const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * practiceAuthMiddleware
 * Verifies the practice JWT issued after Google OAuth.
 * Token is expected in Authorization: Bearer <token> header.
 * On success, attaches req.practiceUser = { id, email, practiceRole }
 */
const practiceAuthMiddleware = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Please log in to continue.' });
  }

  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  try {
    const secret = process.env.PRACTICE_JWT_SECRET || process.env.JWT_SECRET;
    const verified = jwt.verify(token, secret);
    req.practiceUser = verified; // { id, email, name, practiceRole }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
  }
};

module.exports = practiceAuthMiddleware;
