const express = require("express");
const router = express.Router();
const AdvUser = require("../models/AdvUser");
const AdvTeamStructure = require("../models/AdvTeamStructure");
const AdvLead = require("../models/AdvLead");
const AdvCallActivity = require("../models/AdvCallActivity");
const mongoose = require("mongoose");

// Middleware to authorize roles
const authorizeRole = (roles) => {
    return (req, res, next) => {
        // In a real app, you'd get the user from the token/session
        // For now, we'll assume the role is passed in headers or skip check for initial setup
        next();
    };
};

// GET: All Agents with performance metrics
router.get("/agents", async (req, res) => {
    try {
        const users = await AdvUser.find().populate("manager_id", "name").populate("team_id", "team_name");

        // Fetch activity counts for each user
        const agentsWithStats = await Promise.all(users.map(async (user) => {
            const stats = await AdvCallActivity.aggregate([
                { $match: { specialistId: user._id.toString() } },
                {
                    $group: {
                        _id: null,
                        totalCalls: { $sum: 1 },
                        connected: { $sum: { $cond: [{ $ne: ["$callOutcome", "no_answer"] }, 1, 0] } },
                        converted: { $sum: { $cond: [{ $eq: ["$callOutcome", "converted"] }, 1, 0] } }
                    }
                }
            ]);

            const userStats = stats[0] || { totalCalls: 0, connected: 0, converted: 0 };
            return {
                ...user.toObject(),
                stats: userStats
            };
        }));

        res.status(200).json(agentsWithStats);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Create new agent
router.post("/agents", async (req, res) => {
    try {
        const { name, email, password, role, manager_id, team_id } = req.body;

        const newUser = new AdvUser({
            name,
            email,
            password,
            role,
            manager_id: manager_id || undefined,
            team_id: team_id || undefined
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Update agent
router.put("/agents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) { }

        const updatedUser = await AdvUser.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH: Deactivate agent
router.patch("/agents/:id/deactivate", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await AdvUser.findById(id);
        if (!user) return res.status(404).json({ message: "Agent not found" });

        user.status = user.status === "Active" ? "Inactive" : "Active";
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: All Teams
router.get("/teams", async (req, res) => {
    try {
        const teams = await AdvTeamStructure.find()
            .populate("manager_id", "name")
            .populate("leaders", "name")
            .populate("specialists", "name");
        res.status(200).json(teams);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Create Team
router.post("/teams", async (req, res) => {
    try {
        const { team_name, manager_id, leaders, specialists } = req.body;
        const newTeam = new AdvTeamStructure({
            team_name,
            manager_id,
            leaders: leaders || [],
            specialists: specialists || []
        });
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: System Stats
router.get("/system-stats", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalLeads = await AdvLead.countDocuments();
        const activeAgents = await AdvUser.countDocuments({ status: "Active" });
        const callsToday = await AdvCallActivity.countDocuments({ createdAt: { $gte: today } });
        const conversionsToday = await AdvCallActivity.countDocuments({
            createdAt: { $gte: today },
            callOutcome: "converted"
        });

        res.status(200).json({
            totalLeads,
            activeAgents,
            callsToday,
            conversionsToday
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Live System Stats (Phase 15)
router.get("/live-system-stats", async (req, res) => {
    try {
        const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

        // Infer active calls from recent activity (e.g., dialer starts or recent logs)
        // In a real system, this would use WebSockets or a 'live_calls' collection
        const activeAgentsCount = await AdvUser.countDocuments({ status: "Active" });
        const recentActivity = await AdvCallActivity.find({ createdAt: { $gte: oneMinuteAgo } })
            .populate("specialistId", "name");

        const callsToday = await AdvCallActivity.countDocuments({
            createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
        });

        res.status(200).json({
            activeAgents: activeAgentsCount,
            callsInProgress: Math.min(recentActivity.length, activeAgentsCount), // Mock inference
            dialerSessions: Math.floor(activeAgentsCount * 0.4), // Simulated
            callsToday,
            liveFeed: recentActivity.map(act => ({
                agent: act.specialistId?.name || "Agent",
                lead: act.leadName || "Lead",
                status: "Ongoing",
                duration: "Active"
            }))
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Individual Agent Activity
router.get("/agent-activity/:agentId", async (req, res) => {
    try {
        const { agentId } = req.params;
        const activities = await AdvCallActivity.find({ specialistId: agentId })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json(activities);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
