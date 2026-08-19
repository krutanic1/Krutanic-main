const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PracticeUser = require('../models/PracticeUser');
require('dotenv').config();

const secret = process.env.PRACTICE_JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret_123';

/**
 * POST /api/practice-auth/register
 * Body: { name, email, password }
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await PracticeUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await PracticeUser.create({
      name,
      email,
      password: hashedPassword,
      practiceRole: 'user',
      lastLoginAt: new Date(),
    });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, practiceRole: user.practiceRole },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        practiceRole: user.practiceRole,
      },
    });
  } catch (err) {
    console.error('Practice Register Error:', err);
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

/**
 * POST /api/practice-auth/login
 * Body: { email, password }
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await PracticeUser.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    if (!user.password) {
       return res.status(401).json({ message: 'Please login with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, practiceRole: user.practiceRole },
      secret,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        practiceRole: user.practiceRole,
      },
    });
  } catch (err) {
    console.error('Practice Login Error:', err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

/**
 * GET /api/practice-auth/me
 */
const getMe = async (req, res) => {
  try {
    const user = await PracticeUser.findById(req.practiceUser.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error('GetMe Error:', err);
    res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
};

module.exports = { register, login, getMe };
