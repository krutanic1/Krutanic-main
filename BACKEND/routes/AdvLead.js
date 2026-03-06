const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");
const os = require("os");
const upload = multer({ dest: path.join(os.tmpdir(), "uploads") });
const AdvLead = require("../models/AdvLead");
const AdvCallActivity = require("../models/AdvCallActivity");
const AdvFollowup = require("../models/AdvFollowup");
const AdvTeam = require("../models/AdvTeam");
const AdvUser = require("../models/AdvUser");
const AdvNotification = require("../models/AdvNotification");

// POST: Add lead from Google Form with Automation
router.post("/add-adv-lead", async (req, res) => {
    console.log("Receiving Lead Submission:", JSON.stringify(req.body, null, 2));
    let { phone_number, opted_domain, company_name, year_of_passing } = req.body;

    // Backup for field mapping
    if (!opted_domain && req.body.domain) opted_domain = req.body.domain;
    if (!opted_domain && req.body.Domains) opted_domain = req.body.Domains;

    try {
        const existingLead = await AdvLead.findOne({ phone_number });
        if (existingLead) {
            // Update existing lead with new data if it comes again
            await AdvLead.findOneAndUpdate({ phone_number }, { $set: req.body });
            return res.status(200).json({ success: true, message: "Lead Updated", lead: existingLead });
        }

        // --- 1. Rule Engine: Map Domain to Team ---
        const domainToTeamMap = {
            "Data Science": "Team Alpha",
            "Web Development": "Team Beta",
            "AI/ML": "Team Gamma"
        };
        const targetTeamName = domainToTeamMap[opted_domain] || "General Team";
        const team = await AdvTeam.findOne({ team_name: targetTeamName });

        // --- 2. Lead Scoring Logic ---
        let score = 0;
        const normalizedDomain = (opted_domain || "").toLowerCase().trim();
        if (normalizedDomain.includes("data science") || normalizedDomain.includes("ai/ml")) score += 10;

        if (company_name) score += 10;
        const currentYear = new Date().getFullYear();
        if (parseInt(year_of_passing) >= currentYear - 2) score += 5;

        if (req.body.upskilling_ready === "Yes") score += 15;
        if (req.body.start_timeframe === "Immediately") score += 10;

        // --- 3. Auto-assignment & Round-robin ---
        let assignedSpecialistId = null;
        if (team && team.specialists.length > 0) {
            // Find specialist with least assignments (Simple Round-robin)
            const specialists = await AdvUser.find({ _id: { $in: team.specialists } });
            const assignmentCounts = await Promise.all(specialists.map(async (s) => ({
                id: s._id,
                count: await AdvLead.countDocuments({ current_owner_id: s._id })
            })));

            assignmentCounts.sort((a, b) => a.count - b.count);
            assignedSpecialistId = assignmentCounts[0].id;
        }

        const newLead = new AdvLead({
            ...req.body,
            opted_domain: opted_domain, // Ensure the mapped value is used
            source: "google_form",
            status: assignedSpecialistId ? "assigned_to_specialist" : "fresh",
            team_id: team?._id,
            current_owner_id: assignedSpecialistId,
            current_owner_role: assignedSpecialistId ? "sr_inside_sales_specialist" : null,
            score
        });

        await newLead.save();

        // --- 4. Trigger Notification ---
        if (assignedSpecialistId) {
            await new AdvNotification({
                userId: assignedSpecialistId,
                title: "New Lead Assigned",
                message: `Lead ${req.body.full_name} has been assigned to you.`,
                type: "lead_assigned"
            }).save();
        }

        res.status(201).json({ success: true, lead: newLead });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// GET: Count fresh leads
router.get("/fresh-leads-count", async (req, res) => {
    try {
        const count = await AdvLead.countDocuments({ status: "fresh" });
        res.status(200).json({ count });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Bulk assign fresh leads to a manager
router.post("/bulk-assign-to-manager", async (req, res) => {
    const { managerId, managerName, count } = req.body;
    if (!managerId || !count || count < 1) {
        return res.status(400).json({ message: "managerId and count are required" });
    }
    try {
        const freshLeads = await AdvLead.find({ status: "fresh" })
            .sort({ created_at: 1 })
            .limit(parseInt(count));

        if (freshLeads.length === 0) {
            return res.status(404).json({ message: "No fresh leads available to assign" });
        }

        const leadIds = freshLeads.map(l => l._id);

        await AdvLead.updateMany(
            { _id: { $in: leadIds } },
            { $set: { owner_id: managerId, owner_name: managerName, manager_id: managerId, current_owner_role: "manager", status: "assigned_to_manager" } }
        );

        res.status(200).json({ success: true, assigned: freshLeads.length, message: `${freshLeads.length} lead(s) assigned to ${managerName}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Admin bulk-assigns fresh leads to anyone (Manager or Leader)
router.post("/admin-bulk-assign", async (req, res) => {
    const { assigneeId, assigneeName, assigneeRole, count } = req.body;
    if (!assigneeId || !assigneeRole || !count || count < 1) {
        return res.status(400).json({ message: "assigneeId, assigneeRole and count are required" });
    }
    try {
        const freshLeads = await AdvLead.find({ status: "fresh" })
            .sort({ created_at: 1 })
            .limit(parseInt(count));

        if (freshLeads.length === 0) {
            return res.status(404).json({ message: "No fresh leads available to assign" });
        }

        const leadIds = freshLeads.map(l => l._id);

        // Map frontend designation to database role/status
        let dbRole = "manager";
        let dbStatus = "assigned_to_manager";

        if (assigneeRole.includes("Leader")) {
            dbRole = "leader";
            dbStatus = "assigned_to_leader";
        }

        await AdvLead.updateMany(
            { _id: { $in: leadIds } },
            {
                $set: {
                    owner_id: assigneeId,
                    owner_name: assigneeName,
                    current_owner_role: dbRole,
                    status: dbStatus,
                    ...(dbRole === "manager" ? { manager_id: assigneeId } : { leader_id: assigneeId })
                }
            }
        );

        res.status(200).json({
            success: true,
            assigned: freshLeads.length,
            message: `${freshLeads.length} lead(s) assigned to ${assigneeName} (${dbRole})`
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Manager bulk-assigns N of their leads to a leader
router.post("/bulk-assign-to-leader", async (req, res) => {
    const { managerId, leaderId, leaderName, count } = req.body;
    if (!managerId || !leaderId || !count || count < 1) {
        return res.status(400).json({ message: "managerId, leaderId and count are required" });
    }
    try {
        const myLeads = await AdvLead.find({ owner_id: managerId, status: { $nin: ["converted", "closed"] } })
            .sort({ created_at: 1 })
            .limit(parseInt(count));

        if (myLeads.length === 0) {
            return res.status(404).json({ message: "No leads available to assign" });
        }

        const leadIds = myLeads.map(l => l._id);
        await AdvLead.updateMany(
            { _id: { $in: leadIds } },
            { $set: { owner_id: leaderId, owner_name: leaderName, leader_id: leaderId, current_owner_role: "leader", status: "assigned_to_leader" } }
        );

        res.status(200).json({ success: true, assigned: myLeads.length, message: `${myLeads.length} lead(s) assigned to ${leaderName}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Leader bulk-assigns N of their leads to a specialist
router.post("/bulk-assign-to-specialist", async (req, res) => {
    const { leaderId, specialistId, specialistName, count } = req.body;
    if (!leaderId || !specialistId || !count || count < 1) {
        return res.status(400).json({ message: "leaderId, specialistId and count are required" });
    }
    try {
        const myLeads = await AdvLead.find({ owner_id: leaderId, status: { $nin: ["converted", "closed"] } })
            .sort({ created_at: 1 })
            .limit(parseInt(count));

        if (myLeads.length === 0) {
            return res.status(404).json({ message: "No leads available to assign" });
        }

        const leadIds = myLeads.map(l => l._id);
        await AdvLead.updateMany(
            { _id: { $in: leadIds } },
            { $set: { owner_id: specialistId, owner_name: specialistName, specialist_id: specialistId, current_owner_role: "sr_inside_sales_specialist", status: "assigned_to_specialist" } }
        );

        res.status(200).json({ success: true, assigned: myLeads.length, message: `${myLeads.length} lead(s) assigned to ${specialistName}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Fetch leads based on role with team-based isolation
router.get("/get-adv-leads", async (req, res) => {
    const { role, userId, page = 1, limit = 25 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        let query = {};
        const roleNorm = (role || "").toLowerCase();

        if (roleNorm === "admin") {
            // Admin sees all
        } else if (roleNorm.includes("manager")) {
            // Managers see leads assigned to them or their team
            const teams = await AdvTeam.find({ manager_id: userId });
            const teamIds = teams.map(t => t._id);
            const teamNames = teams.map(t => t.team_name);

            query = {
                $or: [
                    { manager_id: userId },
                    { team_id: { $in: teamIds } },
                    { team_name: { $in: teamNames } },
                    { owner_id: userId }
                ]
            };
        } else if (roleNorm.includes("leader")) {
            // Leaders see leads in teams they lead
            const teams = await AdvTeam.find({ leaders: userId });
            const teamIds = teams.map(t => t._id);
            const teamNames = teams.map(t => t.team_name);

            query = {
                $or: [
                    { leader_id: userId },
                    { team_id: { $in: teamIds } },
                    { team_name: { $in: teamNames } },
                    { owner_id: userId },
                    { current_owner_id: userId }
                ]
            };
        } else {
            // Specialists see only their own leads
            query = {
                $or: [
                    { owner_id: userId },
                    { current_owner_id: userId }
                ]
            };
        }

        const totalCount = await AdvLead.countDocuments(query);
        const leads = await AdvLead.find(query)
            .populate("team_id", "team_name")
            .populate("current_owner_id", "name")
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            leads,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// PUT: Assign to Team (Admin) — supports team name string from existing system
router.put("/assign-lead-to-team/:id", async (req, res) => {
    const { teamId, teamName } = req.body;
    try {
        const updateData = {
            current_owner_role: "manager",
            status: "assigned_to_team"
        };
        if (teamId) updateData.team_id = teamId;
        if (teamName) updateData.team_name = teamName;

        const lead = await AdvLead.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Assign to Manager (Admin) — uses existing ADV team member IDs
router.put("/assign-lead-to-manager/:id", async (req, res) => {
    const { managerId, managerName } = req.body;
    try {
        const lead = await AdvLead.findByIdAndUpdate(
            req.params.id,
            { owner_id: managerId, owner_name: managerName, manager_id: managerId, current_owner_role: "manager", status: "assigned_to_manager" },
            { new: true }
        );
        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Assign to Leader (Manager)
router.put("/assign-lead-to-leader/:id", async (req, res) => {
    const { leaderId, leaderName } = req.body;
    try {
        const lead = await AdvLead.findByIdAndUpdate(
            req.params.id,
            { owner_id: leaderId, owner_name: leaderName, leader_id: leaderId, current_owner_role: "leader", status: "assigned_to_leader" },
            { new: true }
        );
        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Assign to Specialist (supports existing system IDs)
router.put("/assign-lead-to-specialist/:id", async (req, res) => {
    const { specialistId, specialistName } = req.body;
    try {
        const lead = await AdvLead.findByIdAndUpdate(
            req.params.id,
            { owner_id: specialistId, owner_name: specialistName, specialist_id: specialistId, current_owner_role: "sr_inside_sales_specialist", status: "assigned_to_specialist" },
            { new: true }
        );
        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PUT: Lock Lead
router.put("/lock-lead/:id", async (req, res) => {
    const { userId } = req.body;
    try {
        const lead = await AdvLead.findById(req.params.id);
        if (lead.isLocked && lead.lockedBy.toString() !== userId && (Date.now() - lead.lockTime < 10 * 60 * 1000)) {
            return res.status(403).json({ message: "Lead is currently being worked on by another specialist" });
        }
        lead.isLocked = true;
        lead.lockedBy = userId;
        lead.lockTime = Date.now();
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Log Call
router.post("/log-call/:id", async (req, res) => {
    const { specialistId, outcome, remark, summary } = req.body;
    try {
        const lead = await AdvLead.findById(req.params.id);
        const activity = new AdvCallActivity({
            leadId: lead._id,
            teamId: lead.team_id,
            specialistId,
            callOutcome: outcome,
            remark,
            summary
        });
        await activity.save();

        if (outcome === "interested") lead.status = "in_followup";
        else if (outcome === "converted") lead.status = "converted";
        else if (outcome === "not_interested") lead.status = "closed";

        lead.isLocked = false;
        await lead.save();

        res.status(200).json({ success: true, lead });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Schedule Follow-up
router.post("/schedule-followup/:id", async (req, res) => {
    const { specialistId, followupDate, note } = req.body;
    try {
        const followup = new AdvFollowup({
            leadId: req.params.id,
            specialistId,
            followupDate,
            note
        });
        await followup.save();
        res.status(201).json(followup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Lead Timeline (Aggregation)
router.get("/timeline/:id", async (req, res) => {
    try {
        const leadId = req.params.id;
        const [calls, followups, lead] = await Promise.all([
            AdvCallActivity.find({ leadId }).sort({ createdAt: 1 }),
            AdvFollowup.find({ leadId }).sort({ createdAt: 1 }),
            AdvLead.findById(leadId)
        ]);

        let timeline = [
            { type: "Lead Created", timestamp: lead.created_at, description: "Lead added to system" }
        ];

        calls.forEach(c => {
            timeline.push({
                type: "Call Attempt",
                timestamp: c.createdAt,
                description: `Outcome: ${c.callOutcome}`,
                remark: c.remark
            });
        });

        followups.forEach(f => {
            timeline.push({
                type: "Follow-up Scheduled",
                timestamp: f.createdAt,
                description: `Date: ${new Date(f.followupDate).toLocaleDateString()}`,
                remark: f.note
            });
        });

        timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        res.status(200).json(timeline);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Bulk Import Leads (CSV)
router.post("/bulk-import", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const leads = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (data) => leads.push(data))
        .on("end", async () => {
            try {
                let successCount = 0;
                let failCount = 0;

                for (const leadData of leads) {
                    try {
                        const existingLead = await AdvLead.findOne({ phone_number: leadData.phone_number });
                        if (!existingLead) {
                            const newLead = new AdvLead({
                                ...leadData,
                                source: "csv_import",
                                status: "fresh"
                            });
                            await newLead.save();
                            successCount++;
                        } else {
                            failCount++;
                        }
                    } catch (err) {
                        failCount++;
                    }
                }
                fs.unlinkSync(req.file.path);
                res.status(200).json({ message: "Import completed", successCount, failCount });
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
});

// POST: Log a call activity from Leads Book (SR Inside Sales Specialist)
router.post("/log-call-activity", async (req, res) => {
    const { leadId, specialistId, specialistName, callOutcome, summary, remark, demoScheduleDate } = req.body;
    if (!leadId || !specialistId || !callOutcome) {
        return res.status(400).json({ message: "leadId, specialistId, and callOutcome are required" });
    }
    try {
        // Fetch lead and team context
        const lead = await AdvLead.findById(leadId);
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        const team = lead.team_id ? await AdvTeam.findById(lead.team_id) : null;

        // Save call activity with team/manager context from lead's history
        const activity = new AdvCallActivity({
            leadId,
            teamId: lead.team_id || team?._id,
            managerId: lead.manager_id || team?.manager_id,
            leaderId: lead.leader_id || (team?.leaders?.length > 0 ? team.leaders[0] : undefined),
            specialistStringId: specialistId,
            specialistName: specialistName,
            specialistId: mongoose.Types.ObjectId.isValid(specialistId) ? specialistId : undefined,
            remark,
            summary,
            callOutcome,
            demoScheduleDate: demoScheduleDate || undefined,
        });
        await activity.save();

        // Update lead status based on outcome
        const statusMap = {
            interested: "in_followup",
            converted: "converted",
            not_interested: "closed",
            no_answer: undefined,
            callback_requested: "in_followup",
        };
        const newStatus = statusMap[callOutcome];
        const updateFields = {};
        if (newStatus) updateFields.status = newStatus;
        if (demoScheduleDate) updateFields.demo_date = demoScheduleDate;

        if (Object.keys(updateFields).length > 0) {
            await AdvLead.findByIdAndUpdate(leadId, { $set: updateFields });
        }

        res.status(201).json({ success: true, activity });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Get call activities for a specific lead
router.get("/lead-call-history/:leadId", async (req, res) => {
    try {
        const activities = await AdvCallActivity.find({ leadId: req.params.leadId }).sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Get call activities for Manager/Leader (Record Page)
router.get("/get-adv-record", async (req, res) => {
    const { role, userId, page = 1, limit = 25 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        let query = {};
        const roleNorm = (role || "").toLowerCase();

        if (roleNorm.includes("manager")) {
            query = { managerId: userId };
        } else if (roleNorm.includes("leader")) {
            query = { leaderId: userId };
        } else {
            return res.status(403).json({ message: "Access denied" });
        }

        const totalCount = await AdvCallActivity.countDocuments(query);
        const activities = await AdvCallActivity.find(query)
            .populate("leadId", "full_name phone_number opted_domain company_name")
            .populate("specialistId", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json({
            activities,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
