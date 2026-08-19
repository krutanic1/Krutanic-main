const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/practiceAuthController');
const practiceAuth = require('../middleware/practiceAuth');

// POST /api/practice-auth/register
router.post('/practice-auth/register', register);

// POST /api/practice-auth/login
router.post('/practice-auth/login', login);

// GET /api/practice-auth/me
router.get('/practice-auth/me', practiceAuth, getMe);

module.exports = router;
