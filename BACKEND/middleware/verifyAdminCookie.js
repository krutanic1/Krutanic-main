const jwt = require("jsonwebtoken");

const verifyAdminCookie = (req, res, next) => {
  let token = req.cookies.adminToken;
  let authHeader = req.headers.authorization;

  if (!token && authHeader) {
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    } else {
      token = authHeader;
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyAdminCookie;
