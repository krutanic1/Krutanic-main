const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const rateLimit = require('express-rate-limit');

// Rate limiting: 10 requests per 5 minutes per IP (production)
const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  message: { error: 'Too many search requests. Try again in 5 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Job search endpoint with rate limiting
router.post('/search', searchLimiter, jobController.searchJobs);

// SSE progress stream endpoint
router.get('/:jobId/progress', jobController.streamProgress);

// Get job results with pagination
router.get('/:jobId/results', jobController.getJobResults);

// Health check endpoint
router.get('/health', jobController.healthCheck);

module.exports = router;
