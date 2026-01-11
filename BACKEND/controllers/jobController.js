const axios = require('axios');
const crypto = require('crypto');
const EventEmitter = require('events');
const JobSearch = require('../models/JobSearch');
const { getRedisClient } = require('../config/redis');

// Generate UUID without external library (compatible with Node 18)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Event emitter for SSE progress broadcasting
const progressEmitter = new EventEmitter();
progressEmitter.setMaxListeners(100);

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8001';
const PYTHON_API_KEY = process.env.PYTHON_SERVICE_API_KEY || 'dev-key-123';
const CACHE_TTL = 1800; // 30 minutes
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // ms
const PLATFORM_TIMEOUT = 90000; // 90s per platform

// Debug logging
console.log('🔑 Backend API Key:', PYTHON_API_KEY ? `${PYTHON_API_KEY.substring(0, 10)}...` : 'NOT SET');
console.log('🌐 Python Service URL:', PYTHON_SERVICE_URL);

/**
 * Generate normalized cache key (excludes company to improve hit rates)
 */
function generateCacheKey(keyword, platforms, location, experience, remoteStatus) {
  const normalized = {
    keyword: keyword.toLowerCase().trim(),
    platforms: platforms.sort().join(','),
    location: location ? location.toLowerCase().trim() : '',
    experience: experience || '',
    remoteStatus: remoteStatus || ''
  };
  const keyString = JSON.stringify(normalized);
  return crypto.createHash('md5').update(keyString).digest('hex');
}

/**
 * Deduplicate jobs based on title + company + location
 */
function deduplicateJobs(jobs) {
  const seen = new Set();
  return jobs.filter(job => {
    const key = `${job.jobTitle}|${job.company}|${job.location}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Convert Python snake_case response to MongoDB camelCase
 */
function convertToCamelCase(job) {
  return {
    jobTitle: job.job_title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    jobUrl: job.job_url,
    platform: job.platform,
    postedDate: job.posted_date,
    descriptionSnippet: job.description_snippet,
    employmentType: job.employment_type,
    remoteStatus: job.remote_status,
    scrapedAt: job.scraped_at || new Date()
  };
}

/**
 * Emit progress update for SSE clients
 */
function emitProgress(jobId, progressData) {
  progressEmitter.emit(jobId, progressData);
}

/**
 * Call Python service with retry logic
 */
async function callPythonServiceWithRetry(searchParams, retryCount = 0) {
  try {
    const response = await axios.post(`${PYTHON_SERVICE_URL}/scrape-jobs`, searchParams, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PYTHON_API_KEY
      },
      timeout: PLATFORM_TIMEOUT
    });
    return response.data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAYS[retryCount];
      console.log(`⏳ Retry ${retryCount + 1}/${MAX_RETRIES} after ${delay}ms for platform ${searchParams.platforms[0]}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return callPythonServiceWithRetry(searchParams, retryCount + 1);
    }
    throw error;
  }
}

/**
 * Process job search asynchronously (called after job submission)
 */
async function processJobSearchAsync(jobId, searchParams) {
  console.log(`🚀 Starting async processing for job ${jobId}`);
  console.log(`📋 Search params:`, JSON.stringify(searchParams, null, 2));
  
  try {
    await JobSearch.findOneAndUpdate(
      { jobId },
      { status: 'processing', progress: { platformsCompleted: 0, totalPlatforms: searchParams.platforms.length } }
    );
    console.log(`✅ Updated job ${jobId} status to processing`);

    emitProgress(jobId, {
      status: 'processing',
      message: 'Starting job search...',
      platformsCompleted: 0,
      totalPlatforms: searchParams.platforms.length
    });

    const allJobs = [];
    let platformsCompleted = 0;

    console.log(`🔄 Starting platform processing for ${searchParams.platforms.length} platforms:`, searchParams.platforms);

    // Process each platform sequentially
    for (const platform of searchParams.platforms) {
      console.log(`\n🎯 Processing platform: ${platform}`);
      try {
        const singlePlatformParams = {
          ...searchParams,
          platforms: [platform]
        };

        console.log(`📤 Calling Python service for ${platform}...`);
        const platformResult = await callPythonServiceWithRetry(singlePlatformParams);
        console.log(`📥 Python service response for ${platform}:`, platformResult.jobs ? `${platformResult.jobs.length} jobs` : 'FAILED');
        
        if (platformResult.jobs && Array.isArray(platformResult.jobs) && platformResult.jobs.length > 0) {
          // Convert snake_case to camelCase for MongoDB
          const camelCaseJobs = platformResult.jobs.map(convertToCamelCase);
          allJobs.push(...camelCaseJobs);
          platformsCompleted++;

          await JobSearch.findOneAndUpdate(
            { jobId },
            { 
              $push: { results: { $each: camelCaseJobs } },
              'progress.platformsCompleted': platformsCompleted
            }
          );

          emitProgress(jobId, {
            status: 'processing',
            message: `Completed ${platform}: ${platformResult.jobs.length} jobs found`,
            platform,
            platformJobs: platformResult.jobs.length,
            platformsCompleted,
            totalPlatforms: searchParams.platforms.length
          });
        }
      } catch (platformError) {
        console.error(`❌ Platform ${platform} failed:`, platformError.message);
        emitProgress(jobId, {
          status: 'processing',
          message: `${platform} failed, continuing with others`,
          platform,
          error: platformError.message,
          platformsCompleted,
          totalPlatforms: searchParams.platforms.length
        });
      }
    }

    // Deduplicate results
    const uniqueJobs = deduplicateJobs(allJobs);

    // Update final status - completed if at least one platform responded (even with 0 jobs)
    const finalStatus = platformsCompleted > 0 ? 
                       (uniqueJobs.length > 0 ? 'completed' : 'completed') : 
                       'failed';

    await JobSearch.findOneAndUpdate(
      { jobId },
      { 
        status: finalStatus,
        results: uniqueJobs,
        completedAt: new Date()
      }
    );

    // Cache results
    try {
      const redis = getRedisClient();
      if (redis && redis.status === 'ready') {
        const cacheKey = generateCacheKey(
          searchParams.keyword,
          searchParams.platforms,
          searchParams.location,
          searchParams.experience,
          searchParams.remoteStatus
        );
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify({
          jobId,
          results: uniqueJobs,
          totalJobs: uniqueJobs.length,
          platformsSearched: platformsCompleted,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (cacheError) {
      console.error('⚠️ Cache save failed:', cacheError.message);
    }

    emitProgress(jobId, {
      status: finalStatus,
      message: finalStatus === 'completed' ? 
        uniqueJobs.length > 0 ? `Search complete! Found ${uniqueJobs.length} unique jobs` : 'Search complete. No jobs found for this query.' :
        'Search failed across all platforms',
      totalJobs: uniqueJobs.length,
      platformsCompleted,
      totalPlatforms: searchParams.platforms.length
    });

  } catch (error) {
    console.error(`❌ Job ${jobId} processing failed:`, error);
    await JobSearch.findOneAndUpdate(
      { jobId },
      { 
        status: 'failed',
        errorMessage: error.message,
        completedAt: new Date()
      }
    );

    emitProgress(jobId, {
      status: 'failed',
      message: 'Search failed: ' + error.message,
      error: error.message
    });
  }
}

/**
 * Submit job search (async) - returns jobId immediately
 */
const searchJobs = async (req, res) => {
  console.log(`📥 Received job search request`);
  
  try {
    const {
      keyword,
      platforms = ['linkedin', 'indeed', 'unstop'],
      experience,
      company,
      remoteStatus,
      location,
      resultsPerSite = 20
    } = req.body;

    console.log(`🔍 Search params - Keyword: ${keyword}, Platforms: ${platforms.join(',')}, Location: ${location || 'any'}`);

    // Validation
    if (!keyword || keyword.trim().length === 0) {
      return res.status(400).json({ error: 'Job keyword is required' });
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      return res.status(400).json({ error: 'At least one platform must be selected' });
    }

    const validPlatforms = ['linkedin', 'indeed', 'unstop'];
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
    if (invalidPlatforms.length > 0) {
      return res.status(400).json({ 
        error: `Invalid platforms: ${invalidPlatforms.join(', ')}. Valid options: ${validPlatforms.join(', ')}` 
      });
    }

    // Check cache
    const cacheKey = generateCacheKey(keyword, platforms, location, experience, remoteStatus);
    try {
      const redis = getRedisClient();
      if (redis && redis.status === 'ready') {
        const cached = await redis.get(cacheKey);
        if (cached) {
          const cachedData = JSON.parse(cached);
          console.log(`✅ Cache hit for key: ${cacheKey}`);
          return res.status(200).json({
            success: true,
            jobId: cachedData.jobId,
            cached: true,
            totalJobs: cachedData.totalJobs,
            platformsSearched: cachedData.platformsSearched,
            timestamp: cachedData.timestamp,
            message: 'Results from cache'
          });
        }
      }
    } catch (cacheError) {
      console.error('⚠️ Cache check failed:', cacheError.message);
    }

    // Create job search record
    const jobId = uuidv4();
    const searchParams = {
      keyword,
      platforms,
      experience,
      company,
      remoteStatus,
      location,
      resultsPerSite
    };

    await JobSearch.create({
      jobId,
      status: 'queued',
      searchParams,
      cacheKey,
      createdAt: new Date()
    });

    // Start async processing (non-blocking)
    processJobSearchAsync(jobId, searchParams).catch(err => {
      console.error(`❌ Async processing error for job ${jobId}:`, err);
    });

    // Return jobId immediately
    res.status(202).json({
      success: true,
      jobId,
      status: 'queued',
      message: 'Job search queued. Use jobId to check progress.',
      progressEndpoint: `/api/jobs/${jobId}/progress`,
      resultsEndpoint: `/api/jobs/${jobId}/results`
    });

  } catch (error) {
    console.error('❌ searchJobs error:', error);
    res.status(500).json({ 
      error: 'Failed to submit job search',
      details: error.message 
    });
  }
};

/**
 * Stream job progress via SSE
 */
const streamProgress = async (req, res) => {
  const { jobId } = req.params;

  try {
    // Verify job exists
    const job = await JobSearch.findOne({ jobId });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Setup SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial status
    res.write(`data: ${JSON.stringify({
      status: job.status,
      progress: job.progress,
      message: `Current status: ${job.status}`
    })}\n\n`);

    // Listen for progress updates
    const progressHandler = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      
      // Close connection on completion/failure
      if (['completed', 'failed', 'partial'].includes(data.status)) {
        progressEmitter.removeListener(jobId, progressHandler);
        res.end();
      }
    };

    progressEmitter.on(jobId, progressHandler);

    // Cleanup on client disconnect
    req.on('close', () => {
      progressEmitter.removeListener(jobId, progressHandler);
      res.end();
    });

  } catch (error) {
    console.error('❌ streamProgress error:', error);
    res.status(500).json({ error: 'Failed to stream progress' });
  }
};

/**
 * Get job results with pagination
 */
const getJobResults = async (req, res) => {
  try {
    const { jobId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const job = await JobSearch.findOne({ jobId });
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status === 'queued' || job.status === 'processing') {
      return res.status(202).json({
        status: job.status,
        progress: job.progress,
        message: 'Job still processing. Please wait or use SSE endpoint for real-time updates.'
      });
    }

    if (job.status === 'failed') {
      return res.status(200).json({
        success: false,
        status: 'failed',
        message: job.errorMessage || 'Job search failed',
        jobs: []
      });
    }

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedJobs = job.results.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      status: job.status,
      results: paginatedJobs,
      pagination: {
        currentPage: page,
        totalJobs: job.results.length,
        totalPages: Math.ceil(job.results.length / limit),
        hasMore: endIndex < job.results.length
      },
      searchParams: job.searchParams,
      completedAt: job.completedAt
    });

  } catch (error) {
    console.error('❌ getJobResults error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve job results',
      details: error.message 
    });
  }
};

/**
 * Health check endpoint
 */
const healthCheck = async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {}
  };

  // Check MongoDB
  try {
    const mongoose = require('mongoose');
    health.services.mongodb = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch (err) {
    health.services.mongodb = 'error';
    health.status = 'degraded';
  }

  // Check Redis
  try {
    const redis = getRedisClient();
    health.services.redis = redis && redis.status === 'ready' ? 'connected' : 'disconnected';
  } catch (err) {
    health.services.redis = 'error';
    health.status = 'degraded';
  }

  // Check Python service
  try {
    const pythonHealth = await axios.get(`${PYTHON_SERVICE_URL}/health`, { timeout: 5000 });
    health.services.pythonScraper = pythonHealth.status === 200 ? 'connected' : 'error';
  } catch (err) {
    health.services.pythonScraper = 'error';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
};

module.exports = {
  searchJobs,
  streamProgress,
  getJobResults,
  healthCheck
};
