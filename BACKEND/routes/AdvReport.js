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

// Export Leads (CSV/Excel)
router.get("/export/leads", async (req, res) => {
    try {
        const { startDate, endDate, stage, format } = req.query;
        let query = {};
        if (startDate && endDate) query.created_at = { $gte: new Date(startDate), $lte: new Date(endDate) };
        if (stage && stage !== 'all') query.stage = stage;

        const leads = await AdvLead.find(query).lean();

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

        const leads = await AdvLead.find(query).lean();

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

module.exports = router;
