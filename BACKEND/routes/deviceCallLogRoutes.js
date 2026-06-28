const express = require("express");
const router = express.Router();
const DeviceCallLog = require("../models/DeviceCallLog");

// @route   POST /api/call-logs/sync
// @desc    Sync multiple call logs from a device
// @access  Public or Protected (Depending on middleware used later)
router.post("/sync", async (req, res) => {
    try {
        const { callLogs } = req.body;

        if (!callLogs || !Array.isArray(callLogs)) {
            return res.status(400).json({ success: false, message: "Invalid call logs data" });
        }

        // We use bulkWrite to efficiently upsert (insert or update) each call log based on deviceCallId
        const operations = callLogs.map((log) => ({
            updateOne: {
                filter: { deviceCallId: log.deviceCallId },
                update: { $set: log },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            const result = await DeviceCallLog.bulkWrite(operations);
            return res.status(200).json({ 
                success: true, 
                message: "Call logs synced successfully",
                upsertedCount: result.upsertedCount,
                modifiedCount: result.modifiedCount
            });
        }

        res.status(200).json({ success: true, message: "No call logs to sync" });

    } catch (error) {
        console.error("Error syncing call logs:", error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
});

// @route   GET /api/call-logs
// @desc    Get all call logs
// @access  Public or Protected
router.get("/", async (req, res) => {
    try {
        const callLogs = await DeviceCallLog.find().sort({ startedAt: -1 }).limit(100);
        res.status(200).json({ success: true, count: callLogs.length, data: callLogs });
    } catch (error) {
        console.error("Error fetching call logs:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
