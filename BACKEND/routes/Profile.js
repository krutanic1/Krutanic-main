const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/UserAuth");

// GET /profile?userId=...
router.get("/profile", authMiddleware, async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (userId !== req.user.id) return res.status(403).json({ message: "Unauthorized access to profile" });
    try {
        const profile = await Profile.findOne({ userId }).lean();
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        return res.status(200).json(profile);
    } catch (error) {
        console.error("GET /profile error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// POST /profile — create or upsert
router.post("/profile", authMiddleware, async (req, res) => {
    const { userId, email, personal, education, experience, projects, skills, extra } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });
    if (userId !== req.user.id) return res.status(403).json({ message: "Unauthorized access to profile" });
    try {
        const profile = await Profile.findOneAndUpdate(
            { userId },
            { userId, email, personal, education, experience, projects, skills, extra },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.status(200).json({ message: "Profile saved successfully", profile });
    } catch (error) {
        console.error("POST /profile error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

// PUT /profile/:userId — explicit update
router.put("/profile/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params;
    if (userId !== req.user.id) return res.status(403).json({ message: "Unauthorized access to profile" });
    const { personal, education, experience, projects, skills, extra } = req.body;
    try {
        const profile = await Profile.findOneAndUpdate(
            { userId },
            { personal, education, experience, projects, skills, extra },
            { new: true }
        );
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        return res.status(200).json({ message: "Profile updated", profile });
    } catch (error) {
        console.error("PUT /profile error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
