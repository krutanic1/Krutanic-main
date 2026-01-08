const NodeCache = require('node-cache');

/**
 * In-Memory Cache Utility for Serverless Environment
 * 
 * Purpose:
 * - Reduce MongoDB queries on frequently accessed data
 * - Improve API response times
 * - Zero cost (no external cache service needed)
 * 
 * Cache Instances:
 * - static: For rarely changing data (courses, operations, BDA) - 5 min TTL
 * - dynamic: For frequently changing data (enrollments) - 1 min TTL
 */

// Create cache instances with different TTLs for different data types
const cacheInstances = {
    // Static/semi-static data (courses, operations, BDA)
    static: new NodeCache({
        stdTTL: 300,           // 5 minutes default
        checkperiod: 60,       // Check for expired keys every 60 seconds
        useClones: false,      // Return reference (faster, but don't mutate!)
        deleteOnExpire: true,
        maxKeys: 100           // Prevent memory bloat
    }),

    // Dynamic data (enrollments)
    dynamic: new NodeCache({
        stdTTL: 60,            // 1 minute default
        checkperiod: 30,
        useClones: false,
        deleteOnExpire: true,
        maxKeys: 50
    })
};

/**
 * Wrapper function for cached database queries
 * 
 * Usage:
 * const courses = await cachedQuery(
 *   'courses:all',
 *   () => CreateCourse.find().lean(),
 *   300,
 *   'static'
 * );
 * 
 * @param {string} cacheKey - Unique cache key (e.g., "courses:all")
 * @param {Function} queryFn - Async function that fetches data from DB
 * @param {number} ttl - Time to live in seconds (optional, uses default)
 * @param {string} cacheType - 'static' or 'dynamic'
 * @returns {Promise<any>} Cached or fresh data
 */
async function cachedQuery(cacheKey, queryFn, ttl = null, cacheType = 'static') {
    const cache = cacheInstances[cacheType];

    // Try to get from cache
    const cachedData = cache.get(cacheKey);
    if (cachedData !== undefined) {
        console.log(`✅ [CACHE HIT] ${cacheKey}`);
        return cachedData;
    }

    // Cache miss - fetch from database
    console.log(`❌ [CACHE MISS] ${cacheKey} - Fetching from DB...`);
    const data = await queryFn();

    // Store in cache
    if (ttl) {
        cache.set(cacheKey, data, ttl);
    } else {
        cache.set(cacheKey, data); // Use default TTL
    }

    console.log(`💾 [CACHE STORED] ${cacheKey} (TTL: ${ttl || (cacheType === 'static' ? 300 : 60)}s)`);

    return data;
}

/**
 * Invalidate specific cache key
 * 
 * Usage:
 * invalidateCache('courses:all', 'static');
 * 
 * @param {string} cacheKey - Cache key to invalidate
 * @param {string} cacheType - 'static' or 'dynamic'
 */
function invalidateCache(cacheKey, cacheType = 'static') {
    const cache = cacheInstances[cacheType];
    const deleted = cache.del(cacheKey);

    if (deleted > 0) {
        console.log(`🗑️  [CACHE INVALIDATED] ${cacheKey}`);
    } else {
        console.log(`⚠️  [CACHE INVALIDATE FAILED] ${cacheKey} - Key not found`);
    }
}

/**
 * Invalidate all caches (use on critical updates)
 * 
 * Usage:
 * invalidateAllCaches();
 */
function invalidateAllCaches() {
    Object.values(cacheInstances).forEach(cache => cache.flushAll());
    console.log('🧹 [CACHE CLEARED] All caches flushed');
}

/**
 * Get cache statistics (for monitoring)
 * 
 * Usage:
 * const stats = getCacheStats();
 * 
 * @returns {Object} Statistics for all cache instances
 */
function getCacheStats() {
    const staticStats = cacheInstances.static.getStats();
    const dynamicStats = cacheInstances.dynamic.getStats();

    return {
        static: {
            keys: staticStats.keys,
            hits: staticStats.hits,
            misses: staticStats.misses,
            hitRate: staticStats.hits + staticStats.misses > 0
                ? `${((staticStats.hits / (staticStats.hits + staticStats.misses)) * 100).toFixed(2)}%`
                : 'N/A'
        },
        dynamic: {
            keys: dynamicStats.keys,
            hits: dynamicStats.hits,
            misses: dynamicStats.misses,
            hitRate: dynamicStats.hits + dynamicStats.misses > 0
                ? `${((dynamicStats.hits / (dynamicStats.hits + dynamicStats.misses)) * 100).toFixed(2)}%`
                : 'N/A'
        }
    };
}

module.exports = {
    cachedQuery,
    invalidateCache,
    invalidateAllCaches,
    getCacheStats
};
