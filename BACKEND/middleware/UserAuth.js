const jwt = require("jsonwebtoken");
require("dotenv").config();


const authMiddleware = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Access denied" });

    // Remove "Bearer " prefix if present
    if (token.startsWith("Bearer ")) {
        token = token.slice(7);
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports  = authMiddleware;