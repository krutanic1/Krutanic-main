const jwt = require("jsonwebtoken");

/**
 * Middleware to verify EITHER an admin session (via cookie)
 * OR a staff/user session (via Authorization header).
 */
const verifyAnyAuth = (req, res, next) => {
  let authHeader = req.headers.authorization;
  const adminToken = req.cookies.adminToken;

  // 1. Try Authorization Header first
  if (authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      authHeader = authHeader.slice(7);
    }
    try {
      const decoded = jwt.verify(authHeader, process.env.JWT_SECRET);
      req.user = decoded;
      
      // If the header token matches the admin cookie, flag as admin
      if (adminToken && authHeader === adminToken) {
        req.admin = decoded;
      } else if (!decoded.id && decoded.email) {
        // Fallback admin check based on typical admin token payload
        req.admin = decoded;
      }
      
      return next();
    } catch (error) {
       return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  // 2. Try Admin Cookie fallback
  if (adminToken) {
    try {
      const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
      req.admin = decoded;
      req.user = decoded; // Support shared usage
      return next();
    } catch (error) {
      // Ignore error and fall through to 403
    }
  }

  // 3. No valid authentication found
  return res.status(403).json({ message: "Unauthorized: Access denied" });
};

module.exports = verifyAnyAuth;
