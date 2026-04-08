const express = require("express");
const router = express.Router();
const AdvTeam = require("../models/CreateAdvTeam");

// PUT: Update heartbeat and active time
router.put("/heartbeat", async (req, res) => {
    try {
        const { userId, currentScreen } = req.body;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await AdvTeam.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const now = new Date();
        const lastActive = new Date(user.lastActiveAt);
        
        let increment = 30; // Heartbeat interval in seconds
        
        // Check if it's a new day (reset logic)
        const isNewDay = now.toDateString() !== lastActive.toDateString();
        
        let updateData = {
            $set: { 
                lastActiveAt: now,
                currentScreen: currentScreen || user.currentScreen
            }
        };

        if (isNewDay) {
            // Start fresh for a new day
            updateData.$set.todayActiveTime = increment;
        } else {
            // Increment existing active time
            updateData.$inc = { todayActiveTime: increment };
        }

        const updatedUser = await AdvTeam.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        res.status(200).json({ 
            success: true, 
            todayActiveTime: updatedUser.todayActiveTime 
        });
    } catch (error) {
        console.error("Heartbeat error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// GET: Fetch all active users for Admin monitor
router.get("/live-status", async (req, res) => {
    try {
        // Find users active in the last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        const users = await AdvTeam.find({
            lastActiveAt: { $gte: fiveMinutesAgo },
            status: "Active"
        }).select("fullname email designation lastActiveAt todayActiveTime currentScreen");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching live status" });
    }
});

module.exports = router;
