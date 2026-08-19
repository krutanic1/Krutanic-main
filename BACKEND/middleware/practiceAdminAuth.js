const practiceAuthMiddleware = require('./practiceAuth');

/**
 * practiceAdminAuth
 * First verifies the practice JWT, then checks that the user has practiceRole = 'admin'.
 * Stack this after practiceAuthMiddleware, or use it standalone (it calls practiceAuth internally).
 */
const practiceAdminAuth = (req, res, next) => {
  // 1. Allow LMS Admins via adminToken cookie
  const adminToken = req.cookies.adminToken;
  if (adminToken) {
    try {
      const jwt = require('jsonwebtoken');
      const secret = process.env.JWT_SECRET;
      const decoded = jwt.verify(adminToken, secret);
      // If it successfully decodes, treat as admin
      req.practiceUser = { practiceRole: 'admin', isLmsAdmin: true };
      return next();
    } catch (err) {
      // Fall through to standard practiceAuth
    }
  }

  // 2. Otherwise use standard practice auth
  practiceAuthMiddleware(req, res, () => {
    if (!req.practiceUser) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (req.practiceUser.practiceRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  });
};

module.exports = practiceAdminAuth;
