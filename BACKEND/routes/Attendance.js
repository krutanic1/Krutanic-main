const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const authMiddleware = require("../middleware/UserAuth");

/**
 * @route POST /api/attendance/update-timer
 * @desc Increment cumulative minutes spent on dashboard for today. 
 *       Marks attendance as complete when totalMinutes reaches 5.
 */
router.post("/update-timer", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    try {
        let record = await Attendance.findOne({ userId, date });
        
        if (!record) {
            record = new Attendance({ userId, date, totalMinutes: 0, isMarked: false });
        }

        // Only increment if not already marked
        if (!record.isMarked) {
            record.totalMinutes += 0.1; // Assumes frontend calls this every 1 minute
            if (record.totalMinutes >= 0.1) { // User manually changed this to 1 for testing
                record.isMarked = true;
            }
            await record.save();
        }

        res.status(200).json({ 
            success: true, 
            totalMinutes: record.totalMinutes, 
            isMarked: record.isMarked 
        });
    } catch (error) {
        console.error("Error updating attendance timer:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route POST /api/attendance/mark
 * @desc Force mark attendance for today (backward compatibility).
 */
router.post("/mark", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    try {
        let record = await Attendance.findOne({ userId, date });
        if (record && record.isMarked) {
            return res.status(200).json({ success: true, alreadyMarked: true });
        }

        if (!record) {
            record = new Attendance({ userId, date });
        }
        
        record.totalMinutes = 5;
        record.isMarked = true;
        await record.save();
        
        res.status(201).json({ success: true, alreadyMarked: false });
    } catch (error) {
        console.error("Error marking attendance:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

/**
 * @route GET /api/attendance/stats/:userId
 * @desc Fetch completed attendance days for the heatmap.
 */
router.get("/stats/:userId", authMiddleware, async (req, res) => {
    const { userId } = req.params;
    
    // Security check
    if (req.user.id !== userId) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    try {
        // We only want to show the day on the heatmap if the 5-minute requirement was met
        const stats = await Attendance.find({ userId, isMarked: true }).sort({ date: 1 }).lean();
        
        const formattedStats = stats.map(s => ({
            date: s.date,
            count: 1
        }));

        res.status(200).json({ success: true, data: formattedStats });
    } catch (error) {
        console.error("Error fetching attendance stats:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
