const express = require("express");
const router = express.Router();
const AdvNotification = require("../models/AdvNotification");

// GET: Fetch user notifications
router.get("/:userId", async (req, res) => {
    try {
        const notifications = await AdvNotification.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT: Mark notification as read
router.put("/read/:id", async (req, res) => {
    try {
        await AdvNotification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
