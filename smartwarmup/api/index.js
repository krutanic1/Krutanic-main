const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const dbConnect = require('../src/config/db');
const otpService = require('../src/services/otpService');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middleware/authMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Connection (Async check in middleware for serverless robustness)
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      if (!process.env.MONGODB_URI) {
        console.error('CRITICAL: MONGODB_URI is missing in environment variables');
      }
      await dbConnect();
      next();
    } catch (err) {
      console.error('DB middleware error:', err.message);
      return res.status(500).json({ 
        status: 'error', 
        message: 'Database connection failed. Please check MONGODB_URI in your environment variables.',
        details: err.message
      });
    }
  } else {
    next();
  }
});

// Routes
app.get('/', (req, res) => {
  res.redirect('/api');
});

app.get('/api', (req, res) => {
  res.status(200).json({ status: 'success', message: 'SmartWarmup API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    uptime: process.uptime(),
    timestamp: Date.now(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Auth Routes
app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  console.log(`POST /api/auth/send-otp received for email: ${email}`);
  
  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email is required' });
  }

  try {
    const result = await otpService.processOTPRequest(email);
    res.status(200).json(result);
  } catch (error) {
    console.error('OTP request error:', error.message);
    res.status(error.message === 'Email not authorized for login' ? 403 : 500)
       .json({ status: 'error', message: error.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ status: 'error', message: 'Email and OTP are required' });
  }

  try {
    const result = await otpService.verifyOTP(email, otp);
    
    // Generate JWT token if verification is successful
    const token = jwt.sign(
      { email: email.toLowerCase() },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      ...result, 
      token,
      user: { email: email.toLowerCase() } 
    });
  } catch (error) {
    console.error('OTP verification error:', error.message);
    res.status(401).json({ status: 'error', message: error.message });
  }
});

// Admin Mail Management (Protected or for internal use)
app.post('/api/admin/add-mail', async (req, res) => {
  const { email } = req.body;
  const AdminMail = require('../src/models/AdminMail');
  
  try {
    const exists = await AdminMail.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ status: 'error', message: 'Email already exists' });
    
    await AdminMail.create({ email: email.toLowerCase() });
    res.status(201).json({ status: 'success', message: 'Admin email added' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Sample route to test email sending
app.post('/api/test-email', async (req, res) => {
  const { smtpConfig, mailOptions } = req.body;
  const { sendMail } = require('../src/services/mailer');
  
  try {
    const info = await sendMail(smtpConfig, mailOptions);
    res.status(200).json({ status: 'success', messageId: info.messageId });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Sample route to test IMAP fetching
app.post('/api/test-imap', async (req, res) => {
  const { imapConfig } = req.body;
  const { fetchEmails } = require('../src/services/imap');
  
  try {
    const results = await fetchEmails(imapConfig);
    res.status(200).json({ status: 'success', resultsCount: results.length });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Bulk add accounts
app.post('/api/accounts/bulk-add', async (req, res) => {
  const accounts = req.body;
  const Account = require('../src/models/Account');

  if (!Array.isArray(accounts)) {
    return res.status(400).json({ status: 'error', message: 'Input must be an array of accounts' });
  }

  try {
    const result = await Account.insertMany(accounts, { ordered: false });
    res.status(201).json({ 
      status: 'success', 
      message: `${result.length} accounts added`,
      count: result.length 
    });
  } catch (error) {
    if (error.writeErrors) {
      const insertedCount = error.result.nInserted;
      res.status(207).json({ 
        status: 'partial_success', 
        message: `${insertedCount} accounts added, some failed`,
        errors: error.writeErrors.length,
        count: insertedCount
      });
    } else {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
});

// Get all accounts
app.get('/api/accounts', authMiddleware, async (req, res) => {
  const Account = require('../src/models/Account');
  try {
    const accounts = await Account.find({}).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', data: accounts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Toggle warmup for an account
app.post('/api/accounts/:id/toggle-warmup', authMiddleware, async (req, res) => {
  const Account = require('../src/models/Account');
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ status: 'error', message: 'Account not found' });
    
    // Toggle enabled status (handle missing field by defaulting to false if it was 'on' by absence)
    const currentStatus = account.warmup?.enabled !== false; 
    account.warmup = {
      ...account.warmup,
      enabled: !currentStatus
    };
    
    await account.save();
    res.status(200).json({ status: 'success', enabled: account.warmup.enabled });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Start warmup process (Schedule jobs for 24h)
app.post('/api/warmup/start', authMiddleware, async (req, res) => {
  const Account = require('../src/models/Account');
  const WarmupJob = require('../src/models/WarmupJob');
  const { generate24hJobs } = require('../src/utils/warmup-scheduler');

  try {
    // 1. Fetch enabled accounts (or those with the field missing, treating as enabled by default)
    const accounts = await Account.find({ 
      $or: [
        { 'warmup.enabled': true }, 
        { 'warmup.enabled': { $exists: false } }
      ] 
    });
    
    const uniqueDomains = new Set(accounts.map(a => a.user.split('@')[1]));
    
    if (accounts.length < 2 || uniqueDomains.size < 2) {
      return res.status(400).json({ 
        status: 'error', 
        message: `Requirement not met: Found ${accounts.length} accounts across ${uniqueDomains.size} unique domains. Need at least 2 of each.`
      });
    }

    // 2. Generate jobs
    const jobs = generate24hJobs(accounts);

    // 3. Save to DB
    await WarmupJob.insertMany(jobs);

    res.status(200).json({ 
      status: 'success', 
      message: `Warmup started. ${jobs.length} jobs scheduled for the next 24 hours.`,
      accountCount: accounts.length
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Stop warmup process (Clear pending jobs)
app.post('/api/warmup/stop', authMiddleware, async (req, res) => {
  const WarmupJob = require('../src/models/WarmupJob');
  try {
    const result = await WarmupJob.deleteMany({ status: 'pending' });
    res.status(200).json({ status: 'success', message: 'Warmup stopped. Pending jobs cleared.', deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get warmup status
app.get('/api/warmup/status', authMiddleware, async (req, res) => {
  const WarmupJob = require('../src/models/WarmupJob');
  try {
    const totalJobsToday = await WarmupJob.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    const pendingJobs = await WarmupJob.countDocuments({ status: 'pending' });
    const finishedJobs = await WarmupJob.countDocuments({ 
      status: 'done',
      updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });
    
    // Find earliest pending or processing job to approximate start time
    const earliestJob = await WarmupJob.findOne({ status: { $in: ['done', 'processing', 'pending'] } })
      .sort({ createdAt: 1 });

    res.status(200).json({
      status: 'success',
      totalJobsToday,
      pendingJobs,
      finishedJobs,
      startedAt: earliestJob ? earliestJob.createdAt : null,
      serverTime: new Date()
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
app.get('/api/cron/process-warmup', authMiddleware, async (req, res) => {
  const Account = require('../src/models/Account');
  const WarmupJob = require('../src/models/WarmupJob');
  const { sendMail } = require('../src/services/mailer');

  try {
    const jobs = await WarmupJob.find({
      status: 'pending',
      scheduledAt: { $lte: new Date() }
    }).limit(20);

    if (jobs.length === 0) {
      return res.status(200).json({ status: 'success', message: 'No pending jobs to process' });
    }

    const results = await Promise.allSettled(jobs.map(async (job) => {
      let sender = null;
      try {
        job.status = 'processing';
        await job.save();

        sender = await Account.findById(job.accountId);
        const target = await Account.findById(job.targetId);

        if (!sender || !target) throw new Error('Account not found');

        // Check for Daily Limit and Auto-Reset
        const now = new Date();
        const lastReset = sender.warmup?.lastLimitReset ? new Date(sender.warmup.lastLimitReset) : new Date(0);
        const hoursSinceReset = (now - lastReset) / (1000 * 60 * 60);

        if (hoursSinceReset >= 24) {
          console.log(`Resetting warmup counts for ${sender.user}`);
          sender.warmup.sentToday = 0;
          sender.warmup.lastLimitReset = now;
          await sender.save();
        }

        if (sender.warmup?.sentToday >= sender.warmup?.dailyLimit) {
          throw new Error(`Daily limit (${sender.warmup.dailyLimit}) reached for ${sender.user}`);
        }

        const rawHost = String(sender.smtp?.host || process.env.DEFAULT_SMTP_HOST || 'smtp.gmail.com').trim();
        const rawPort = sender.smtp?.port || process.env.DEFAULT_SMTP_PORT || 465;

        // More aggressive local check: any host that looks local
        const isLocal = rawHost === 'localhost' || 
                        rawHost === '127.0.0.1' || 
                        rawHost === '0.0.0.0' || 
                        rawHost === '::1' || 
                        rawHost.includes('local') || 
                        rawHost === '';
                        
        const smtpHost = isLocal ? 'smtp.gmail.com' : rawHost;
        const smtpPort = isLocal ? 465 : rawPort;

        console.log(`[Job ${job._id}] Sender: ${sender.user}, Host: ${smtpHost}, Port: ${smtpPort} (Raw: ${rawHost}:${rawPort})`);

        await sendMail({
          host: smtpHost,
          port: smtpPort,
          user: sender.user,
          pass: sender.pass
        }, {
          to: target.user,
          // Leaving subject and text undefined will trigger generateDynamicContent internally
        });

        job.status = 'done';
        await job.save();
        await Account.findByIdAndUpdate(sender._id, { $inc: { 'warmup.sentToday': 1 } });
        return { jobId: job._id, status: 'done' };
      } catch (error) {
        job.attempts += 1;
        // Include host/port in error for debugging
        const rawHost = String(sender?.smtp?.host || process.env.DEFAULT_SMTP_HOST || 'smtp.gmail.com').trim();
        const rawPort = sender?.smtp?.port || process.env.DEFAULT_SMTP_PORT || 465;
        job.error = `${error.message} (Target: ${rawHost}:${rawPort})`;
        
        job.status = (job.attempts < 3) ? 'pending' : 'failed';
        if (job.status === 'pending') job.scheduledAt = new Date(Date.now() + 5 * 60 * 1000);
        await job.save();
        throw error;
      }
    }));

    res.status(200).json({ status: 'success', processed: jobs.length });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get activity logs
app.get('/api/logs', async (req, res) => {
  const WarmupJob = require('../src/models/WarmupJob');
  const Account = require('../src/models/Account');
  try {
    const jobs = await WarmupJob.find({ status: { $in: ['done', 'failed', 'processing'] } })
      .sort({ updatedAt: -1 })
      .limit(50);
    
    // Manual hydration because of collection mapping might be tricky with populate
    const accountIds = [...new Set([...jobs.map(j => j.accountId), ...jobs.map(j => j.targetId)])];
    const accounts = await Account.find({ _id: { $in: accountIds } });
    const accMap = accounts.reduce((map, acc) => {
      map[acc._id.toString()] = acc.user;
      return map;
    }, {});

    const hydratedLogs = jobs.map(j => ({
      _id: j._id,
      sender: accMap[j.accountId.toString()] || 'Unknown',
      recipient: accMap[j.targetId.toString()] || 'Unknown',
      status: j.status,
      scheduledAt: j.scheduledAt,
      completedAt: j.updatedAt,
      error: j.error
    }));

    res.status(200).json({ status: 'success', data: hydratedLogs });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Vercel Cron: Check for replies and respond
app.get('/api/cron/check-replies', authMiddleware, async (req, res) => {
  const Account = require('../src/models/Account');
  const { fetchUnreadEmails } = require('../src/services/imap');
  const { sendMail, generateReply } = require('../src/services/mailer');

  try {
    const accounts = await Account.find({ 'warmup.enabled': true });
    const allPartners = accounts.map(a => a.user.toLowerCase());

    const summary = [];
    const { decrypt } = require('../src/utils/crypto');

    // Helper: Wrap promise with timeout
    const withTimeout = (promise, ms, label) => {
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error(`Timeout: ${label} exceeded ${ms}ms`)), ms)
      );
      return Promise.race([promise, timeout]);
    };

    // Process in batches of 5
    const BATCH_SIZE = 5;
    for (let i = 0; i < accounts.length; i += BATCH_SIZE) {
      const batch = accounts.slice(i, i + BATCH_SIZE);
      console.log(`Reply-check batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(accounts.length/BATCH_SIZE)}...`);
      
      await Promise.allSettled(batch.map(async (acc) => {
        try {
          const rawImapHost = String(process.env.DEFAULT_IMAP_HOST || 'imap.gmail.com').trim();
          const rawImapPort = parseInt(process.env.DEFAULT_IMAP_PORT) || 993;

          const isLocalImap = rawImapHost === 'localhost' || rawImapHost === '127.0.0.1' || rawImapHost === '0.0.0.0' || rawImapHost === '::1';
          const imapHost = isLocalImap ? 'imap.gmail.com' : rawImapHost;
          const imapPort = isLocalImap ? 993 : rawImapPort;

          const unread = await withTimeout(
            fetchUnreadEmails({
              user: acc.user,
              pass: decrypt(acc.pass),
              host: imapHost,
              port: imapPort
            }),
            15000,
            acc.user
          );

          const warmupEmails = unread.filter(email => 
            allPartners.includes(email.from.toLowerCase())
          );

          for (const email of warmupEmails) {
            if (Math.random() > 0.3) {
              const reply = await withTimeout(
                generateReply(email.subject, email.text),
                10000,
                `reply-${email.from}`
              );
              const rawSmtpHost = String(process.env.DEFAULT_SMTP_HOST || 'smtp.gmail.com').trim();
              const rawSmtpPort = parseInt(process.env.DEFAULT_SMTP_PORT) || 465;

              const isLocalSmtp = rawSmtpHost === 'localhost' || rawSmtpHost === '127.0.0.1' || rawSmtpHost === '0.0.0.0' || rawSmtpHost === '::1';
              const smtpHost = isLocalSmtp ? 'smtp.gmail.com' : rawSmtpHost;
              const smtpPort = isLocalSmtp ? 465 : rawSmtpPort;

              await withTimeout(
                sendMail({
                  host: smtpHost,
                  port: smtpPort,
                  user: acc.user,
                  pass: acc.pass
                }, {
                  to: email.from,
                  subject: reply.subject,
                  text: reply.body
                }),
                10000,
                `send-${email.from}`
              );
              summary.push({ account: acc.user, repliedTo: email.from });
            }
          }
        } catch (err) {
          console.error(`Reply error for ${acc.user}:`, err.message);
        }
      }));
    }

    res.status(200).json({ status: 'success', repliesSent: summary.length, details: summary });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  // Local Debug: Simulate Vercel Cron every 60 seconds
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  console.log('Local Cron Simulator: Starting (every 60s)...');
  setInterval(async () => {
    console.log('Local Cron: Running process-warmup...');
    const WarmupJob = require('../src/models/WarmupJob');
    const Account = require('../src/models/Account');
    // We can't easily mock req/res here, so I'll refactor the logic or just let the user use the endpoint
    // Actually, I'll just trigger the endpoint internally using a helper or just fetch the URL
    try {
      // Simulate the GET request for processing jobs
      const http = require('http');
      http.get('http://localhost:5000/api/cron/process-warmup', (res) => {
        console.log(`Local Cron (Process): Status ${res.statusCode}`);
      });
      
      // Simulate the GET request for checking replies (every 5 mins is better but for test every 60s is fine)
      http.get('http://localhost:5000/api/cron/check-replies', (res) => {
        console.log(`Local Cron (Replies): Status ${res.statusCode}`);
      });
    } catch (e) {
      console.error('Local Cron Error:', e.message);
    }
  }, 60000); 
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}

module.exports = app;
