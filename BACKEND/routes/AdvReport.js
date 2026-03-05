const express = require("express");
const router = express.Router();
const AdvCallActivity = require("../models/AdvCallActivity");
const AdvLead = require("../models/AdvLead");
const AdvFollowup = require("../models/AdvFollowup");
const AdvUser = require("../models/AdvUser");

// Specialist Performance (Calls today/yesterday)
router.get("/specialist-stats/:id", async (req, res) => {
    const specialistId = req.params.id;
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const todayCalls = await AdvCallActivity.countDocuments({
            specialistId,
            createdAt: { $gte: today }
        });

        const yesterdayCalls = await AdvCallActivity.countDocuments({
            specialistId,
            createdAt: { $gte: yesterday, $lt: today }
        });

        const pendingFollowups = await AdvFollowup.countDocuments({
            specialistId,
            status: "pending",
            followupDate: { $lte: new Date() }
        });

        res.status(200).json({
            todayCalls,
            yesterdayCalls,
            pendingFollowups
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Leader Dashboard (Specialist Productivity in Team)
router.get("/leader-productivity/:teamId", async (req, res) => {
    try {
        const teamLeads = await AdvUser.find({ team_id: req.params.teamId, role: "sr_inside_sales_specialist" });

        const stats = await Promise.all(teamLeads.map(async (user) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const callsToday = await AdvCallActivity.countDocuments({ specialistId: user._id, createdAt: { $gte: today } });
            const conversions = await AdvCallActivity.countDocuments({ specialistId: user._id, callOutcome: "converted" });

            return {
                specialistName: user.name,
                callsToday,
                conversions
            };
        }));

        res.status(200).json(stats);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Sales Leaderboard (Global)
router.get("/leaderboard", async (req, res) => {
    try {
        const topSpecialists = await AdvCallActivity.aggregate([
            { $match: { callOutcome: "converted" } },
            { $group: { _id: "$specialistId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $lookup: { from: "advusers", localField: "_id", foreignField: "_id", as: "user" } },
            { $unwind: "$user" },
            { $project: { name: "$user.name", conversions: "$count" } }
        ]);
        res.status(200).json(topSpecialists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Conversion Funnel Analytics
router.get("/funnel", async (req, res) => {
    try {
        const total = await AdvLead.countDocuments();
        const assigned = await AdvLead.countDocuments({ status: { $ne: "fresh" } });
        const contacted = await AdvCallActivity.distinct("leadId");
        const followups = await AdvFollowup.distinct("leadId");
        const converted = await AdvLead.countDocuments({ status: "converted" });

        res.status(200).json({
            total,
            assigned,
            contacted: contacted.length,
            followups: followups.length,
            converted
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Performance Alerts (Inactive Specialists)
router.get("/performance-alerts", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const specialists = await AdvUser.find({ role: "sr_inside_sales_specialist" });
        const inactiveSpecialists = [];

        for (const s of specialists) {
            const callsCount = await AdvCallActivity.countDocuments({
                specialistId: s._id,
                createdAt: { $gte: today }
            });
            if (callsCount < 10) {
                inactiveSpecialists.push({
                    name: s.name,
                    callsToday: callsCount,
                    teamId: s.team_id
                });
            }
        }
        res.status(200).json(inactiveSpecialists);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin Global Stats
router.get("/admin-global-stats", async (req, res) => {
    try {
        const totalLeads = await AdvLead.countDocuments();
        const freshLeads = await AdvLead.countDocuments({ status: "fresh" });
        const convertedLeads = await AdvLead.countDocuments({ status: "converted" });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const totalCallsToday = await AdvCallActivity.countDocuments({ createdAt: { $gte: today } });

        res.status(200).json({
            totalLeads,
            freshLeads,
            convertedLeads,
            totalCallsToday
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
