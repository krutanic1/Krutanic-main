const jwt = require("jsonwebtoken");

/**
 * Middleware to verify EITHER an admin session (via cookie)
 * OR a staff/user session (via Authorization header).
 */
const verifyAnyAuth = (req, res, next) => {
  const adminToken = req.cookies.adminToken;
  let authHeader = req.headers.authorization;

  // 1. Try Admin Cookie first
  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
      req.admin = decoded;
      req.user = decoded; // Support shared usage
      return next();
    } catch (error) {
      // If admin token is invalid, we don't immediately fail, 
      // we check for header token below.
    }
  }

  // 2. Try Authorization Header (BDA, Operation, Users)
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      authHeader = authHeader.slice(7);
    }
    try {
      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (error) {
       return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  // 3. No valid authentication found
  return res.status(403).json({ message: "Unauthorized: Access denied" });
};

module.exports = verifyAnyAuth;
