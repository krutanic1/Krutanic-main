const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Define a rate limiter: maximum 5 requests per IP per hour
const formRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: 'Too many requests from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Helper function to forward to Google Apps Script (URL Encoded)
const forwardToGoogleUrlEncoded = async (req, res, url) => {
  try {
    const params = new URLSearchParams(req.body);
    const response = await axios.post(url, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error forwarding to Google Forms (URL Encoded):', error.message);
    return res.status(500).json({ result: 'error', error: 'Failed to submit form' });
  }
};

// Helper function to forward to Google Apps Script (JSON / Text Plain)
const forwardToGoogleJson = async (req, res, url) => {
  try {
    const response = await axios.post(url, JSON.stringify(req.body), {
      headers: { 'Content-Type': 'text/plain' }
    });
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error forwarding to Google Forms (JSON):', error.message);
    return res.status(500).json({ result: 'error', error: 'Failed to submit form' });
  }
};

// Route for Enrollment Form (Adobe Certified Training)
router.post('/submit-enrollment', formRateLimiter, async (req, res) => {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL_ENROLLMENT;
  if (!url) return res.status(500).json({ success: false, message: 'Server configuration error' });
  await forwardToGoogleUrlEncoded(req, res, url);
});

// Route for Data Analyst Form
router.post('/submit-data-analytics', formRateLimiter, async (req, res) => {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL_DATA_ANALYTICS;
  if (!url) return res.status(500).json({ success: false, message: 'Server configuration error' });
  await forwardToGoogleUrlEncoded(req, res, url);
});

// Route for MedPro Form
router.post('/submit-medpro', formRateLimiter, async (req, res) => {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL_MEDPRO;
  if (!url) return res.status(500).json({ success: false, message: 'Server configuration error' });
  await forwardToGoogleJson(req, res, url);
});

module.exports = router;
