const express = require("express");
const router = express.Router();
const AdvCallActivity = require("../models/AdvCallActivity");
const AdvLead = require("../models/AdvLead");
const AdvFollowup = require("../models/AdvFollowup");
const AdvUser = require("../models/AdvUser");
const AdvEnroll = require("../models/AdvEnroll");
const AdvTeamMember = require("../models/CreateAdvTeam");
const mongoose = require("mongoose");

const META_BLACKLIST = [
    "id", "created_time", "ad_id", "ad_name", "adset_id", "adset_name", 
    "campaign_id", "campaign_name", "form_id", "form_name", "is_organic", 
    "platform", "lead_status", "meta_lead_id", "facebook_ad_name", 
    "facebook_campaign_name", "facebook_form_id", "facebook_created_time",
    "extra_fields" // Report routes usually don't need extra_fields, safe to hide entirely
];

const BLACKLIST_PROJECTION = META_BLACKLIST.map(f => `-${f}`).join(" ");

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

// GET: Daily Targets (Today's count and talk time vs Targets)
router.get("/daily-targets/:id", async (req, res) => {
    const specialistId = req.params.id;
    const { date } = req.query;
    try {
        const filterDate = date ? new Date(date) : new Date();
        filterDate.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(filterDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Fetch user designation
        const user = await AdvTeamMember.findById(specialistId);
        if (!user) {
            return res.status(404).json({ message: "Specialist not found" });
        }

        const designation = (user.designation || "").toLowerCase();
        
        // Define Targets
        let targets = {
            callTarget: 0,
            talkTimeTarget: 0 // in seconds
        };

        if (designation.includes("sr inside sales specialist") || designation.includes("sr_inside_sales_specialist")) {
            targets.callTarget = 150;
            targets.talkTimeTarget = 5 * 3600; // 5 hours in seconds
        } else if (designation.includes("inside sales specialist") || designation.includes("inside_sales_specialist")) {
            targets.callTarget = 120;
            targets.talkTimeTarget = 4 * 3600; // 4 hours in seconds
        }

        // Calculate stats for the selected date
        const activities = await AdvCallActivity.find({
            $or: [
                { specialistId: mongoose.Types.ObjectId.isValid(specialistId) ? specialistId : undefined },
                { specialistStringId: specialistId }
            ],
            actionType: "call",
            createdAt: { $gte: filterDate, $lt: nextDate }
        });

        const todayCallCount = activities.length;
        // Only count talk time for calls >= 5 minutes (300 seconds)
        const todayTalkTime = activities.reduce((acc, curr) => {
            const duration = curr.duration || 0;
            return duration >= 300 ? acc + duration : acc;
        }, 0);

        // Global Leaderboard for the day (across all specialists)
        const teamStats = await AdvCallActivity.aggregate([
            {
                $match: {
                    actionType: "call",
                    createdAt: { $gte: filterDate, $lt: nextDate }
                }
            },
            {
                $group: {
                    _id: "$specialistName",
                    callCount: { $sum: 1 },
                    talkTime: {
                        $sum: {
                            $cond: [{ $gte: ["$duration", 300] }, "$duration", 0]
                        }
                    }
                }
            }
        ]);

        const leadingCaller = teamStats.length > 0 ? teamStats.reduce((prev, curr) => (prev.callCount > curr.callCount ? prev : curr)) : null;
        const leadingSpeaker = teamStats.length > 0 ? teamStats.reduce((prev, curr) => (prev.talkTime > curr.talkTime ? prev : curr)) : null;

        res.status(200).json({
            callCount: todayCallCount,
            talkTime: todayTalkTime,
            targets,
            leaderboard: {
                leadingCaller: leadingCaller ? { name: leadingCaller._id, count: leadingCaller.callCount } : null,
                leadingSpeaker: leadingSpeaker ? { name: leadingSpeaker._id, talkTime: leadingSpeaker.talkTime } : null
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ADV Team Leaderboard
router.get("/adv-leaderboard", async (req, res) => {
    try {
        const { date, month, year } = req.query;
        let startDate, endDate;

        if (month && year) {
            startDate = new Date(year, parseInt(month) - 1, 1);
            endDate = new Date(year, parseInt(month), 1);
        } else {
            startDate = date ? new Date(date) : new Date();
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
        }

        const teamStats = await AdvCallActivity.aggregate([
            {
                $match: {
                    actionType: "call",
                    createdAt: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: "$specialistName",
                    callCount: { $sum: 1 },
                    talkTime: {
                        $sum: {
                            $cond: [{ $gte: ["$duration", 300] }, "$duration", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    name: "$_id",
                    callCount: 1,
                    talkTime: 1,
                    _id: 0
                }
            }
        ]);

        const revenueStats = await AdvEnroll.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: "$counselor",
                    revenue: { $sum: "$programPrice" }
                }
            }
        ]);

        const mergedStats = {};
        
        teamStats.forEach(stat => {
            if (stat.name) {
                mergedStats[stat.name] = {
                    name: stat.name,
                    callCount: stat.callCount,
                    talkTime: stat.talkTime,
                    revenue: 0
                };
            }
        });

        revenueStats.forEach(stat => {
            if (stat._id) {
                if (!mergedStats[stat._id]) {
                    mergedStats[stat._id] = {
                        name: stat._id,
                        callCount: 0,
                        talkTime: 0,
                        revenue: 0
                    };
                }
                mergedStats[stat._id].revenue = stat.revenue;
            }
        });

        res.status(200).json(Object.values(mergedStats));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Leader Dashboard (Specialist Productivity in Team)
router.get("/leader-productivity/:teamId", async (req, res) => {
    try {
        const teamLeads = await AdvUser.find({ team_id: req.params.teamId, role: { $in: ["sr_inside_sales_specialist", "inside_sales_specialist"] }, status: "Active" });

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

// Domain-wise Monthly Analysis
router.get("/domain-monthly-stats", async (req, res) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

        const stats = await AdvLead.aggregate([
            {
                $match: {
                    created_at: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    month: { $month: "$created_at" },
                    domain: { $ifNull: ["$opted_domain", "Unknown"] }
                }
            },
            {
                $group: {
                    _id: { month: "$month", domain: "$domain" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.month": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const pivotData = months.map((m, i) => ({ month: m }));
        const uniqueDomains = new Set();

        stats.forEach(s => {
            const monthIdx = s._id.month - 1;
            const domainName = s._id.domain || "Unknown";
            pivotData[monthIdx][domainName] = s.count;
            uniqueDomains.add(domainName);
        });

        // Fill missing zeros for all domains in all months to keep chart consistent
        pivotData.forEach(item => {
            uniqueDomains.forEach(domain => {
                if (!item[domain]) item[domain] = 0;
            });
        });

        res.status(200).json({ 
            data: pivotData, 
            domains: Array.from(uniqueDomains) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
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
            { $match: { "user.status": "Active" } },
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
        const [total, assigned, converted, contactedGroup, followupsGroup] = await Promise.all([
            AdvLead.countDocuments(),
            AdvLead.countDocuments({ status: { $ne: "fresh" } }),
            AdvLead.countDocuments({ status: "converted" }),
            AdvCallActivity.aggregate([
                { $group: { _id: "$leadId" } },
                { $count: "count" }
            ]),
            AdvFollowup.aggregate([
                { $group: { _id: "$leadId" } },
                { $count: "count" }
            ])
        ]);

        res.status(200).json({
            total,
            assigned,
            contacted: contactedGroup[0]?.count || 0,
            followups: followupsGroup[0]?.count || 0,
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

        const specialists = await AdvUser.find({ role: { $in: ["sr_inside_sales_specialist", "inside_sales_specialist"] }, status: "Active" });
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalLeads, freshLeads, convertedLeads, totalCallsToday] = await Promise.all([
            AdvLead.countDocuments(),
            AdvLead.countDocuments({ status: "fresh" }),
            AdvLead.countDocuments({ status: "converted" }),
            AdvCallActivity.countDocuments({ createdAt: { $gte: today } })
        ]);

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

// Export Leads (CSV/Excel)
router.get("/export/leads", async (req, res) => {
    try {
        const { startDate, endDate, stage, format } = req.query;
        let query = {};
        if (startDate && endDate) query.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
        if (stage && stage !== 'all') query.stage = stage;

        const leads = await AdvLead.find(query).select(BLACKLIST_PROJECTION).lean();

        if (format === 'csv') {
            const { Parser } = require('json2csv');
            const fields = ['full_name', 'email', 'phone_number', 'opted_domain', 'stage', 'owner_name', 'created_at'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(leads);
            res.header('Content-Type', 'text/csv');
            res.attachment('leads_report.csv');
            return res.send(csv);
        } else {
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Leads');
            worksheet.columns = [
                { header: 'Full Name', key: 'full_name', width: 25 },
                { header: 'Email', key: 'email', width: 25 },
                { header: 'Phone', key: 'phone_number', width: 15 },
                { header: 'Domain', key: 'opted_domain', width: 20 },
                { header: 'Stage', key: 'stage', width: 15 },
                { header: 'Owner', key: 'owner_name', width: 20 },
                { header: 'Created At', key: 'created_at', width: 20 }
            ];
            worksheet.addRows(leads);
            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment('leads_report.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Export Call Logs
router.get("/export/calls", async (req, res) => {
    try {
        const { startDate, endDate, format } = req.query;
        let query = {};
        if (startDate && endDate) query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };

        const calls = await AdvCallActivity.find(query).populate('specialistId', 'name').lean();

        if (format === 'csv') {
            const { Parser } = require('json2csv');
            const fields = ['createdAt', 'leadName', 'callOutcome', 'duration', 'specialistId.name'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(calls);
            res.header('Content-Type', 'text/csv');
            res.attachment('call_logs.csv');
            return res.send(csv);
        } else {
            const ExcelJS = require('exceljs');
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Call Logs');
            worksheet.columns = [
                { header: 'Date', key: 'createdAt', width: 20 },
                { header: 'Lead', key: 'leadName', width: 20 },
                { header: 'Outcome', key: 'callOutcome', width: 15 },
                { header: 'Duration (sec)', key: 'duration', width: 12 },
                { header: 'Agent', key: 'agentName', width: 20 }
            ];
            const rows = calls.map(c => ({
                ...c,
                agentName: c.specialistId?.name || 'Unknown'
            }));
            worksheet.addRows(rows);
            res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.attachment('call_report.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Export Conversions (CSV/PDF)
router.get("/export/conversions", async (req, res) => {
    try {
        const { startDate, endDate, format } = req.query;
        let query = { stage: 'converted' };
        if (startDate && endDate) query.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) };

        const leads = await AdvLead.find(query).select(BLACKLIST_PROJECTION).lean();

        if (format === 'csv') {
            const { Parser } = require('json2csv');
            const fields = ['full_name', 'email', 'phone_number', 'opted_domain', 'owner_name', 'created_at'];
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(leads);
            res.header('Content-Type', 'text/csv');
            res.attachment('conversions_report.csv');
            return res.send(csv);
        } else {
            const PDFDocument = require('pdfkit');
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment('conversions_report.pdf');
            doc.pipe(res);

            doc.fontSize(20).text('Conversions Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
            doc.moveDown();

            leads.forEach((lead, index) => {
                doc.fontSize(10).text(`${index + 1}. ${lead.full_name} | ${lead.email} | ${lead.opted_domain} | Owner: ${lead.owner_name}`);
                doc.moveDown(0.5);
            });

            doc.end();
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Comprehensive Stats for Domain/Source analysis with Month Filter and Growth
router.get("/comprehensive-stats", async (req, res) => {
    try {
        const { month, year } = req.query;
        const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        const prevStartDate = new Date(targetYear, targetMonth - 1, 1);
        const prevEndDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        // Helper for summary stats
        const getSummary = async (start, end) => {
            const [total, converted, junk] = await Promise.all([
                AdvLead.countDocuments({ created_at: { $gte: start, $lte: end } }),
                AdvLead.countDocuments({ 
                    created_at: { $gte: start, $lte: end }, 
                    $or: [{ last_outcome: "converted" }, { stage: "converted" }] 
                }),
                AdvLead.countDocuments({ 
                    created_at: { $gte: start, $lte: end }, 
                    last_outcome: { $in: ["junk", "not_interested"] } 
                })
            ]);
            return { total, converted, junk };
        };

        const [currentSummary, prevSummary] = await Promise.all([
            getSummary(startDate, endDate),
            getSummary(prevStartDate, prevEndDate)
        ]);

        // Calculate growth
        const calcGrowth = (curr, prev) => {
            if (prev === 0) return curr > 0 ? 100 : 0;
            return parseFloat(((curr - prev) / prev * 100).toFixed(1));
        };

        const growth = {
            total: calcGrowth(currentSummary.total, prevSummary.total),
            converted: calcGrowth(currentSummary.converted, prevSummary.converted),
            junk: calcGrowth(currentSummary.junk, prevSummary.junk)
        };

        // Domain Breakdown
        const domainBreakdown = await AdvLead.aggregate([
            { $match: { created_at: { $gte: startDate, $lte: endDate } } },
            { $group: {
                _id: "$opted_domain",
                total: { $sum: 1 },
                converted: { $sum: { $cond: [{ $or: [{ $eq: ["$last_outcome", "converted"] }, { $eq: ["$stage", "converted"] }] }, 1, 0] } },
                junk: { $sum: { $cond: [{ $in: ["$last_outcome", ["junk", "not_interested"]] }, 1, 0] } }
            }},
            { $project: { domain: "$_id", total: 1, converted: 1, junk: 1, _id: 0 } },
            { $sort: { total: -1 } }
        ]);

        // Source Breakdown
        const sourceBreakdown = await AdvLead.aggregate([
            { $match: { created_at: { $gte: startDate, $lte: endDate } } },
            { $group: {
                _id: "$source",
                total: { $sum: 1 },
                converted: { $sum: { $cond: [{ $or: [{ $eq: ["$last_outcome", "converted"] }, { $eq: ["$stage", "converted"] }] }, 1, 0] } },
                junk: { $sum: { $cond: [{ $in: ["$last_outcome", ["junk", "not_interested"]] }, 1, 0] } }
            }},
            { $project: { source: "$_id", total: 1, converted: 1, junk: 1, _id: 0 } },
            { $sort: { total: -1 } }
        ]);

        res.status(200).json({
            summary: currentSummary,
            growth,
            domainBreakdown,
            sourceBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────
// TEAM ANALYSIS: All members, all 9 outcomes, revenue — one pass
// ─────────────────────────────────────────────────────────────────
router.get("/team-analysis", async (req, res) => {
    try {
        const { month, year } = req.query;
        const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
        const targetYear  = year  ? parseInt(year)  : new Date().getFullYear();

        const startDate = new Date(targetYear, targetMonth, 1);
        const endDate   = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        // 1. Get all team members (all roles)
        const allMembers = await AdvTeamMember.find({ Access: true, status: "Active" }, {
            fullname: 1, designation: 1, team: 1, teams: 1, _id: 1
        }).lean();

        if (!allMembers.length) return res.json({ managers: [], leaders: [], specialists: [] });  

        const memberIds = allMembers.map(m => String(m._id));

        // 2. Leads grouped by owner_id and last_outcome — one aggregation
        const leadAgg = await AdvLead.aggregate([
            {
                $match: {
                    owner_id: { $in: memberIds },
                    created_at: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { owner: "$owner_id", outcome: "$last_outcome" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 3. Revenue from AdvEnroll grouped by counselor (member fullname)
        const memberNames = allMembers.map(m => m.fullname).filter(Boolean);

        const revenueAgg = await AdvEnroll.aggregate([
            {
                $match: {
                    counselor: { $in: memberNames },
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$counselor",
                    totalRevenue:   { $sum: "$programPrice" },
                    totalPaid:      { $sum: "$paidAmount" },
                    enrollCount:    { $sum: 1 }
                }
            }
        ]);

        // 4. Build lookup maps for fast access
        const outcomesMap = {}; // memberId -> { outcome: count }
        const OUTCOMES = ["fresh","interested","follow_up","callback_requested","no_answer","not_interested","junk","converted","unused"];

        for (const row of leadAgg) {
            const { owner, outcome } = row._id;
            if (!outcomesMap[owner]) {
                outcomesMap[owner] = { totalLeads: 0 };
                OUTCOMES.forEach(o => (outcomesMap[owner][o] = 0));
            }
            outcomesMap[owner][outcome || "fresh"] = (outcomesMap[owner][outcome || "fresh"] || 0) + row.count;
            outcomesMap[owner].totalLeads += row.count;
        }

        // revenueMap keyed by counselor name
        const revenueMap = {};
        for (const row of revenueAgg) {
            revenueMap[row._id] = {
                totalRevenue:   row.totalRevenue || 0,
                pendingRevenue: Math.max(0, (row.totalRevenue || 0) - (row.totalPaid || 0)),
                enrollCount:    row.enrollCount || 0
            };
        }

        // 5. Combine into member objects
        const buildMember = (m) => {
            const id   = String(m._id);
            const name = m.fullname;
            const outcomes = outcomesMap[id]   || { totalLeads: 0 };
            const revenue  = revenueMap[name]  || { totalRevenue: 0, pendingRevenue: 0, enrollCount: 0 };
            OUTCOMES.forEach(o => { if (outcomes[o] === undefined) outcomes[o] = 0; });
            return {
                _id: id,
                name,
                designation: m.designation,
                team: m.team || (m.teams && m.teams[0]) || "—",
                ...outcomes,
                ...revenue
            };
        };

        const designationMap = {
            managers:    ["advteam manager", "manager", "adv manager"],
            leaders:     ["adv team leader", "team leader", "leader", "sr team leader"],
            specialists: ["sr inside sales specialist", "inside sales specialist", "sales specialist", "specialist"]
        };

        const categorize = (desig = "") => {
            const d = desig.toLowerCase().trim();
            if (designationMap.managers.some(k => d.includes(k) || k.includes(d))) return "managers";
            if (designationMap.leaders.some(k => d.includes(k) || k.includes(d))) return "leaders";
            return "specialists";
        };

        const result = { managers: [], leaders: [], specialists: [] };
        for (const m of allMembers) {
            const cat = categorize(m.designation);
            result[cat].push(buildMember(m));
        }

        // Sort each group by converted desc
        ["managers", "leaders", "specialists"].forEach(cat => {
            result[cat].sort((a, b) => (b.converted || 0) - (a.converted || 0));
        });

        res.status(200).json(result);
    } catch (err) {
        console.error("team-analysis error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────
// MEMBER MONTHLY TREND: 12-month bar chart for drill-down panel
// ─────────────────────────────────────────────────────────────────
router.get("/member-monthly", async (req, res) => {
    try {
        const { memberId, year } = req.query;
        if (!memberId) return res.status(400).json({ message: "memberId required" });

        // Fetch member name for counselor-based revenue match
        const memberDoc = await AdvTeamMember.findById(memberId, { fullname: 1 }).lean();
        const memberName = memberDoc?.fullname || null;

        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        const startDate  = new Date(targetYear, 0, 1);
        const endDate    = new Date(targetYear, 11, 31, 23, 59, 59, 999);


        const leadsByMonth = await AdvLead.aggregate([
            {
                $match: {
                    owner_id: memberId,
                    created_at: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$created_at" }, outcome: "$last_outcome" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const revenueByMonth = await AdvEnroll.aggregate([
            {
                $match: {
                    counselor: memberName,
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue:  { $sum: "$programPrice" },
                    paid:     { $sum: "$paidAmount" }
                }
            }
        ]);

        const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthly = MONTHS.map((name, i) => ({
            month: name,
            totalLeads: 0, converted: 0, interested: 0, junk: 0, not_interested: 0,
            revenue: 0, pending: 0
        }));

        for (const row of leadsByMonth) {
            const idx = row._id.month - 1;
            const outcome = row._id.outcome || "fresh";
            monthly[idx].totalLeads += row.count;
            if (monthly[idx][outcome] !== undefined) monthly[idx][outcome] += row.count;
        }

        for (const row of revenueByMonth) {
            const idx = row._id - 1;
            monthly[idx].revenue  = row.revenue || 0;
            monthly[idx].pending  = Math.max(0, (row.revenue || 0) - (row.paid || 0));
        }

        res.status(200).json(monthly);
    } catch (err) {
        console.error("member-monthly error:", err);
        res.status(500).json({ message: err.message });
    }
});

// ─────────────────────────────────────────────────────────────────
// OUTCOME CALL LOGS: Leads with specific outcome for a member
// ─────────────────────────────────────────────────────────────────
router.get("/member-outcome-logs", async (req, res) => {
    try {
        const { memberId, outcome, month, year, source } = req.query;
        if (!memberId || !outcome) {
            return res.status(400).json({ message: "memberId and outcome required" });
        }

        const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
        const targetYear  = year  ? parseInt(year)  : new Date().getFullYear();
        const startDate   = new Date(targetYear, targetMonth, 1);
        const endDate     = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);

        const query = {
            owner_id: memberId,
            last_outcome: outcome,
            created_at: { $gte: startDate, $lte: endDate }
        };

        if (source) {
            query.source = source;
        }

        // Get leads with this outcome assigned to this member in the month
        // ⚠️ Note: We explicitly include needed fields and exclude META via BLACKLIST_PROJECTION
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await AdvLead.countDocuments(query);
        const leads = await AdvLead.find(query)
            .select(`full_name phone_number source opted_domain created_at assigned_at last_outcome status`)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Get the latest call activity for each lead
        const leadIds = leads.map(l => l._id);
        const callLogs = await AdvCallActivity.aggregate([
            {
                $match: {
                    leadId: { $in: leadIds },
                    callOutcome: outcome
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$leadId",
                    summary:   { $first: "$summary" },
                    remark:    { $first: "$remark" },
                    calledAt:  { $first: "$createdAt" },
                    agentName: { $first: "$specialistName" }
                }
            }
        ]);

        const callMap = {};
        for (const c of callLogs) {
            callMap[String(c._id)] = c;
        }

        const result = leads.map(lead => ({
            _id:        lead._id,
            name:       lead.full_name,
            phone:      lead.phone_number,
            source:     lead.source?.replace(/_/g, ' '),
            sourceRaw:  lead.source,
            domain:     lead.opted_domain || '—',
            date:       lead.assigned_at || lead.created_at,
            outcome:    lead.last_outcome,
            status:     lead.status,
            summary:    callMap[String(lead._id)]?.summary || '—',
            remark:     callMap[String(lead._id)]?.remark  || '',
            calledAt:   callMap[String(lead._id)]?.calledAt || null,
        }));

        res.status(200).json({ 
            logs: result, 
            total, 
            page, 
            pages: Math.ceil(total / limit) 
        });
    } catch (err) {
        console.error("member-outcome-logs error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Get all call activities (paginated for admin)
router.get("/all-activities", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const skip = (page - 1) * limit;

        const total = await AdvCallActivity.countDocuments();
        const logs = await AdvCallActivity.find()
            .populate("leadId", "full_name phone_number opted_domain")
            .populate({
                path: "specialistId",
                select: "name team_id",
                populate: {
                    path: "team_id",
                    select: "team_name"
                }
            })
            .populate("teamId", "team_name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        res.status(200).json({
            logs,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get aggregated analytics for the dashboard
router.get("/dashboard-analytics", async (req, res) => {
    try {
        // 1. Month-on-Month Call Time
        const monthlyStats = await AdvCallActivity.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    totalDuration: { $sum: "$duration" },
                    callCount: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
            { $limit: 12 } // Last 12 months
        ]);

        // Format month names for the chart
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedMoM = monthlyStats.map(item => ({
            name: `${monthNames[item._id.month - 1]} ${item._id.year}`,
            duration: Math.round((item.totalDuration || 0) / 60), // in minutes
            calls: item.callCount
        }));

        // 2. Specialist Performance
        const agentStats = await AdvCallActivity.aggregate([
            {
                $group: {
                    _id: "$specialistId",
                    totalCalls: { $sum: 1 },
                    totalDuration: { $sum: "$duration" },
                    avgDuration: { $avg: "$duration" },
                    // Capture the recorded specialistName from the documents as a fallback
                    recordedName: { $first: "$specialistName" }
                }
            },
            { $sort: { totalCalls: -1 } },
            { $limit: 20 },
            {
                $lookup: {
                    from: "advusers", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "specialist"
                }
            },
            { $unwind: { path: "$specialist", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    id: "$_id",
                    // Hierarchy: Live Name > Recorded Name > "Unknown Specialist"
                    name: {
                        $ifNull: [
                            "$specialist.name",
                            "$recordedName",
                            "Unknown Specialist"
                        ]
                    },
                    totalCalls: 1,
                    avgDuration: { $round: [{ $divide: ["$avgDuration", 60] }, 1] },
                    totalDuration: { $round: [{ $divide: ["$totalDuration", 60] }, 0] }
                }
            }
        ]);

        res.status(200).json({
            momData: formattedMoM,
            agentStats: agentStats
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
