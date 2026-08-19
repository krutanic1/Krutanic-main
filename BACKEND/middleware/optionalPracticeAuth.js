const jwt = require('jsonwebtoken');
require('dotenv').config();

const optionalPracticeAuth = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return next();

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const secret = process.env.PRACTICE_JWT_SECRET || process.env.JWT_SECRET;
    const verified = jwt.verify(token, secret);
    req.practiceUser = verified;
  } catch (err) {
    // Ignore error, treat as unauthenticated
  }
  next();
};

module.exports = optionalPracticeAuth;
