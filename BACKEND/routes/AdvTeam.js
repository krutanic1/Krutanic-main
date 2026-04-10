const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Types } = mongoose;
const AdvTeamStructure = require("../models/AdvTeamStructure");
const AdvLead = require("../models/AdvLead");
const AdvUser = require("../models/AdvUser");
const AdvTeamMember = require("../models/CreateAdvTeam");
const AdvCallActivity = require("../models/AdvCallActivity");

// GET all teams
router.get("/get-all-teams", async (req, res) => {
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

// POST: Create a new team
router.post("/create-team", async (req, res) => {
    try {
        const newTeam = new AdvTeamStructure(req.body);
        await newTeam.save();
        res.status(201).json(newTeam);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Add leader or specialist to team
router.put("/add-member/:id", async (req, res) => {
    const { userId, role } = req.body;
    try {
        const update = role === 'leader'
            ? { $addToSet: { leaders: userId } }
            : { $addToSet: { specialists: userId } };

        const team = await AdvTeamStructure.findByIdAndUpdate(req.params.id, update, { new: true })
            .populate("manager_id", "name")
            .populate("leaders", "name")
            .populate("specialists", "name");

        res.status(200).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET dashboard stats for a specialist, manager, or leader
router.get("/dashboard-stats", async (req, res) => {
    const { specialistId, role } = req.query;
    if (!specialistId) {
        return res.status(400).json({ message: "Specialist ID is required" });
    }

    try {
        const { Types } = require("mongoose");
        const isValidObjectId = Types.ObjectId.isValid(specialistId);
        const objId = isValidObjectId ? new Types.ObjectId(specialistId) : null;
        const roleNorm = (role || "").toLowerCase();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let leadQuery = {};
        let activityQuery = {};

        if (roleNorm === "admin") {
            // Admin sees everything
            leadQuery = {};
            activityQuery = { createdAt: { $gte: today } };
        } else if (roleNorm.includes("manager") || roleNorm.includes("leader")) {
            // Manager/Leader sees team-wide stats
            const teamFilter = roleNorm.includes("manager") 
                ? { manager_id: specialistId } 
                : { leaders: specialistId };
            
            const teams = await AdvTeamStructure.find(teamFilter);
            const teamIds = teams.map(t => t._id);
            const teamNames = teams.map(t => t.team_name);

            leadQuery = {
                $or: [
                    { team_id: { $in: teamIds } },
                    { team_name: { $in: teamNames } },
                    { manager_id: specialistId },
                    { leader_id: specialistId },
                    { owner_id: specialistId },
                    { current_owner_id: objId }
                ]
            };
            
            activityQuery = {
                $or: [
                    { teamId: { $in: teamIds } },
                    { managerId: objId },
                    { leaderId: objId },
                    { specialistId: objId }
                ],
                createdAt: { $gte: today }
            };
        } else {
            // Specialist sees personal stats
            leadQuery = {
                $or: [
                    { owner_id: specialistId.toString() },
                    { specialist_id: specialistId.toString() }
                ]
            };
            if (objId) leadQuery.$or.push({ current_owner_id: objId });

            activityQuery = {
                $or: [
                    { specialistId: objId },
                    { specialistStringId: specialistId.toString() }
                ],
                createdAt: { $gte: today }
            };
        }

        // 1. Total Leads Assigned (All Time for this scope)
        const totalLeads = await AdvLead.countDocuments(leadQuery);

        // 2. Calls Made (Today)
        const callsMade = await AdvCallActivity.countDocuments(activityQuery);

        // 3. Connected Calls (Today) - Anything except 'no_answer'
        const connectedCalls = await AdvCallActivity.countDocuments({
            ...activityQuery,
            callOutcome: { $ne: "no_answer" }
        });

        // 4. Converted Leads (Today)
        const convertedLeads = await AdvCallActivity.countDocuments({
            ...activityQuery,
            callOutcome: "converted"
        });

        res.status(200).json({
            totalLeads,
            callsMade,
            connectedCalls,
            convertedLeads
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Team Leaderboard (Aggregated)
router.get("/team-leaderboard", async (req, res) => {
    try {
        const leaderboard = await AdvCallActivity.aggregate([
            {
                $group: {
                    _id: "$specialistId",
                    agentName: { $first: "$specialistName" },
                    calls: { $sum: 1 },
                    connected: {
                        $sum: {
                            $cond: [{ $ne: ["$callOutcome", "no_answer"] }, 1, 0]
                        }
                    },
                    converted: {
                        $sum: {
                            $cond: [{ $eq: ["$callOutcome", "converted"] }, 1, 0]
                        }
                    },
                    totalDuration: { $sum: "$duration" }
                }
            },
            { $sort: { converted: -1, calls: -1 } }
        ]);
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Team Performance Analytics
router.get("/team-performance", async (req, res) => {
    try {
        const performance = await AdvCallActivity.aggregate([
            {
                $group: {
                    _id: null,
                    totalCalls: { $sum: 1 },
                    totalConnected: {
                        $sum: {
                            $cond: [{ $ne: ["$callOutcome", "no_answer"] }, 1, 0]
                        }
                    },
                    totalConverted: {
                        $sum: {
                            $cond: [{ $eq: ["$callOutcome", "converted"] }, 1, 0]
                        }
                    }
                }
            }
        ]);
        const result = performance[0] || { totalCalls: 0, totalConnected: 0, totalConverted: 0 };
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Sales Pipeline Stats
router.get("/pipeline-stats", async (req, res) => {
    const { specialistId, timeframe } = req.query;
    try {
        if (!specialistId || (!Types.ObjectId.isValid(specialistId) && typeof specialistId !== 'string')) {
            return res.status(400).json({ message: "Invalid or missing specialistId" });
        }

        let userRole = '';
        let ownerIds = [];
        let legacyOwnerIds = [];
        let matchQuery = {};

        // 1. Try finding in AdvUser (New System)
        let user = await AdvUser.findById(specialistId).catch(() => null);

        if (user) {
            userRole = user.role.toLowerCase();
            ownerIds = [user._id];

            if (userRole === 'admin') {
                // Admin matches everything
                matchQuery = {};
            } else if (userRole === 'leader') {
                const team = await AdvTeamStructure.findOne({ leaders: user._id });
                if (team && team.specialists) {
                    ownerIds = [...ownerIds, ...team.specialists.map(id => new Types.ObjectId(id))];
                }
            } else if (userRole === 'manager') {
                const teams = await AdvTeamStructure.find({ manager_id: user._id });
                teams.forEach(team => {
                    if (team.specialists) ownerIds = [...ownerIds, ...team.specialists.map(id => new Types.ObjectId(id))];
                    if (team.leaders) ownerIds = [...ownerIds, ...team.leaders.map(id => new Types.ObjectId(id))];
                });
            }
        } else {
            // 2. Try finding in AdvTeamMember (Legacy System)
            const legacyUser = await AdvTeamMember.findById(specialistId);
            if (!legacyUser) {
                // If not in either, it might be a global admin from adminMail
                userRole = "admin";
                matchQuery = {};
            } else {
                const designation = (legacyUser.designation || "").toLowerCase();
                legacyOwnerIds = [specialistId.toString()];

                if (designation.includes("manager") || designation.includes("director")) {
                    userRole = "manager";
                } else if (designation.includes("leader")) {
                    userRole = "leader";
                } else {
                    userRole = "sr_inside_sales_specialist";
                }
            }
        }

        // Build Match Query to support both systems (if not already set for admin)
        if (Object.keys(matchQuery).length === 0 && userRole !== 'admin') {
            if (userRole === "manager") {
                matchQuery = {
                    $or: [
                        { manager_id: specialistId.toString() },
                        { current_owner_id: { $in: ownerIds } },
                        { owner_id: { $in: ownerIds.map(id => id.toString()) } }
                    ]
                };
            } else if (userRole === "leader") {
                matchQuery = {
                    $or: [
                        { leader_id: specialistId.toString() },
                        { current_owner_id: { $in: ownerIds } },
                        { owner_id: { $in: ownerIds.map(id => id.toString()) } }
                    ]
                };
            } else {
                matchQuery = {
                    $or: [
                        { current_owner_id: { $in: ownerIds } },
                        { owner_id: specialistId.toString() },
                        { specialist_id: specialistId.toString() }
                    ]
                };
            }
        }

        // Add time filtering if timeframe is provided
        if (timeframe) {
            const now = new Date();
            let startDate = new Date();
            startDate.setHours(0, 0, 0, 0);

            if (timeframe === 'week') {
                startDate.setDate(now.getDate() - 7);
            } else if (timeframe === 'month') {
                startDate.setMonth(now.getMonth() - 1);
            }
            matchQuery.created_at = { $gte: startDate };
        }

        const stats = await AdvLead.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: "$stage",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format into a clean object
        const result = {
            new: 0,
            contacted: 0,
            interested: 0,
            demo_scheduled: 0,
            converted: 0,
            lost: 0
        };

        stats.forEach(s => {
            if (s._id && result.hasOwnProperty(s._id)) {
                result[s._id] = s.count;
            }
        });

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
