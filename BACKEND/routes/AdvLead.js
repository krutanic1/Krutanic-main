const express = require("express");
const router = express.Router();
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const path = require("path");
const os = require("os");
const upload = multer({ dest: path.join(os.tmpdir(), "uploads") });
const AdvLead = require("../models/AdvLead");
const AdvCallActivity = require("../models/AdvCallActivity");
const AdvFollowup = require("../models/AdvFollowup");
const AdvTeamStructure = require("../models/AdvTeamStructure");
const AdvUser = require("../models/AdvUser");
const AdvNotification = require("../models/AdvNotification");
const AdvTeamMember = require("../models/CreateAdvTeam");
const RemoteDialQueue = require("../models/RemoteDialQueue");
const cloudinary = require("../middleware/cloudinary");
const axios = require("axios");
const crypto = require("crypto");

// ✅ Meta Webhook Verification (GET)
router.get("/meta-webhook", (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    const verifyToken = process.env.META_VERIFY_TOKEN || 'meta_krutanic_2026';

    if (mode === 'subscribe' && token === verifyToken) {
        console.log("Meta Webhook Verified ✅");
        return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
});

// ✅ Test Meta Lead Capture Simulation
router.get("/test-meta-lead", (req, res) => {
    res.status(400).json({ error: "Missing Lead ID. Use: /test-meta-lead/[LEAD_ID]" });
});

router.get("/test-meta-lead/:leadId", async (req, res) => {
    const { leadId } = req.params;
    console.log(`🛠️ Manually triggering Meta Lead capture for ID: ${leadId}`);
    try {
        const result = await fetchLeadFromMeta(leadId);
        if (result && result.error) {
            return res.status(400).json({ 
                error: "Meta API rejected the request.", 
                details: result.detail 
            });
        }
        const lead = await processAndSaveLead(result);
        res.status(200).json({ success: true, message: "Lead captured successfully", lead });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Receive Lead Data from Meta (POST request with HMAC Verification)
router.post("/meta-webhook", async (req, res) => {
    console.log("---- 🔔 Meta Webhook Received ----");
    
    // 🛡️ Security Check: HMAC Signature Verification
    const signature = req.headers['x-hub-signature-256'];
    const APP_SECRET = process.env.META_APP_SECRET;

    if (APP_SECRET && signature) {
        const hmac = crypto.createHmac('sha256', APP_SECRET);
        const hash = 'sha256=' + hmac.update(req.rawBody).digest('hex');
        
        if (signature !== hash) {
            console.error("❌ Meta Webhook: Invalid Signature. Request rejected.");
            return res.status(401).json({ error: "Invalid signature" });
        }
        console.log("✅ Meta Webhook Signature Verified.");
    } else if (!APP_SECRET) {
        console.warn("⚠️  META_APP_SECRET missing in .env. Skipping signature verification.");
    }

    const body = req.body;
    if (body.object === 'page') {
        try {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    if (change.field === 'leadgen') {
                        const leadId = change.value.leadgen_id;
                        console.log(`Processing Meta Lead ID: ${leadId}`);
                        const result = await fetchLeadFromMeta(leadId);
                        if (result && !result.error) {
                            await processAndSaveLead(result);
                        }
                    }
                }
            }
            return res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error("Meta Webhook Processing Error:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
    res.status(404).json({ error: "Not a page event" });
});

// Reusable function to process lead scoring, assignment and saving
async function processAndSaveLead(leadPayload) {
    let { phone_number, opted_domain, company_name, year_of_passing, full_name, email, source } = leadPayload;

    // Normalize domains
    if (!opted_domain && leadPayload.domain) opted_domain = leadPayload.domain;
    if (!opted_domain && leadPayload.Domains) opted_domain = leadPayload.Domains;
    if (!opted_domain && leadPayload.ad_name) opted_domain = leadPayload.ad_name;
    if (!opted_domain && leadPayload.campaign_name) opted_domain = leadPayload.campaign_name;

    // Normalize phone
    if (!phone_number && leadPayload.phone) phone_number = leadPayload.phone;
    if (!phone_number && leadPayload.Phone) phone_number = leadPayload.Phone;
    if (phone_number) {
        phone_number = String(phone_number).replace(/^p:/i, '').replace(/\s+/g, '');
    }

    const leadSource = source || "google_form";

    const existingLead = await AdvLead.findOne({ phone_number });
    if (existingLead) {
        // Update existing lead with new data if it comes again
        return await AdvLead.findOneAndUpdate({ phone_number }, { $set: leadPayload }, { new: true });
    }

    // --- 1. Rule Engine: Map Domain to Team ---
    const domainToTeamMap = {
        "Data Science": "Team Alpha",
        "Web Development": "Team Beta",
        "AI/ML": "Team Gamma"
    };
    const targetTeamName = domainToTeamMap[opted_domain] || "General Team";
    const team = await AdvTeamStructure.findOne({ team_name: targetTeamName });

    // --- 2. Lead Scoring Logic ---
    let score = 0;
    const start_timeframe = leadPayload.start_timeframe || leadPayload['how_soon_are_you_planning_to_start?'];
    const upskilling_ready = leadPayload.upskilling_ready || leadPayload['are_you_willing_to_invest_in_a_program_that_provides_training_+_internship_+100%_placement_support?'];

    const normalizedDomain = (opted_domain || "").toLowerCase().trim();
    if (normalizedDomain.includes("data science") || normalizedDomain.includes("ai/ml")) score += 10;
    if (company_name) score += 10;
    const currentYear = new Date().getFullYear();
    if (parseInt(year_of_passing) >= currentYear - 2) score += 5;
    if (upskilling_ready === "Yes") score += 15;
    if (start_timeframe === "Immediately") score += 10;

    // --- 3. Auto-assignment & Round-robin ---
    let assignedSpecialistId = null;
    if (team && team.specialists.length > 0) {
        const specialists = await AdvUser.find({ _id: { $in: team.specialists } });
        const assignmentCounts = await Promise.all(specialists.map(async (s) => ({
            id: s._id,
            count: await AdvLead.countDocuments({ current_owner_id: s._id })
        })));
        assignmentCounts.sort((a, b) => a.count - b.count);
        assignedSpecialistId = assignmentCounts[0].id;
    }

    const newLead = new AdvLead({
        ...leadPayload,
        phone_number,
        opted_domain,
        source: leadSource,
        status: assignedSpecialistId ? "assigned_to_specialist" : "fresh",
        team_id: team?._id,
        current_owner_id: assignedSpecialistId,
        current_owner_role: assignedSpecialistId ? "sr_inside_sales_specialist" : null,
        assigned_at: assignedSpecialistId ? new Date() : undefined,
        extra_fields: leadPayload,
        score
    });

    await newLead.save();

    // --- 4. Trigger Notification ---
    if (assignedSpecialistId) {
        await new AdvNotification({
            userId: assignedSpecialistId,
            title: "New Lead Assigned",
            message: `Lead ${full_name || "New Lead"} has been assigned to you.`,
            type: "lead_assigned"
        }).save();
    }
    return newLead;
}
async function fetchLeadFromMeta(leadId) {
    const accessToken = process.env.META_PAGE_ACCESS_TOKEN;
    if (!accessToken) {
        console.error("META_PAGE_ACCESS_TOKEN is missing in environment variables");
        return { error: true, detail: "Missing Access Token" };
    }
    try {
        // Using v21.0 as it's the current recommended version
        const response = await axios.get(`https://graph.facebook.com/v21.0/${leadId}`, {
            params: { 
                access_token: accessToken,
                fields: "created_time,id,ad_id,ad_name,adset_id,adset_name,campaign_id,campaign_name,form_id,is_organic,field_data"
            }
        });
        const leadData = response.data;
        
        // Start with basic metadata from the root of the response
        const mappedData = { 
            meta_lead_id: leadId, 
            source: "facebook_ad",
            facebook_ad_name: leadData.ad_name,
            facebook_campaign_name: leadData.campaign_name,
            facebook_form_id: leadData.form_id,
            facebook_created_time: leadData.created_time,
            ...leadData // Spread all top-level Meta data for completeness
        };

        // Extract user inputs from field_data
        if (leadData.field_data) {
            leadData.field_data.forEach(field => {
                const name = field.name;
                const value = field.values[0];
                if (name === 'full_name') mappedData.full_name = value;
                else if (name === 'email') mappedData.email = value;
                else if (name === 'phone_number') mappedData.phone_number = value;
                else mappedData[name] = value;
            });
        }
        return mappedData;
    } catch (error) {
        const errorDetail = error.response?.data || error.message;
        console.error("❌ Meta API Error (fetchLeadFromMeta):", {
            leadId,
            status: error.response?.status,
            data: errorDetail,
            message: error.message
        });
        return { error: true, detail: errorDetail };
    }
}


// GET: Fetch counts for all lead outcomes with team-based isolation
router.get("/get-outcome-counts", async (req, res) => {
    const { role, userId, strictlyOwned } = req.query;

    try {
        let baseQuery = {};
        const roleNorm = (role || "").toLowerCase();

        if (roleNorm === "admin") {
            // Admin sees all
        } else if (strictlyOwned === "true") {
            baseQuery = { $or: [{ owner_id: userId }, { current_owner_id: userId }] };
        } else if (roleNorm.includes("manager")) {
            const teams = await AdvTeamStructure.find({ manager_id: userId });
            const teamIds = teams.map(t => t._id);
            const teamNames = teams.map(t => t.team_name);
            baseQuery = {
                $or: [
                    { status: "fresh" },
                    { manager_id: userId },
                    { team_id: { $in: teamIds } },
                    { team_name: { $in: teamNames } },
                    { owner_id: userId },
                    { current_owner_id: userId }
                ]
            };
        } else if (roleNorm.includes("leader")) {
            const teams = await AdvTeamStructure.find({ leaders: userId });
            const teamIds = teams.map(t => t._id);
            const teamNames = teams.map(t => t.team_name);
            baseQuery = {
                $or: [
                    { status: "fresh" },
                    { leader_id: userId },
                    { team_id: { $in: teamIds } },
                    { team_name: { $in: teamNames } },
                    { owner_id: userId },
                    { current_owner_id: userId }
                ]
            };
        } else {
            const isValidId = mongoose.Types.ObjectId.isValid(userId);
            if (isValidId) {
                baseQuery = { $or: [{ owner_id: userId }, { current_owner_id: userId }] };
            } else if (roleNorm === "admin") {
                baseQuery = {};
            } else {
                return res.status(200).json({ fresh: 0, interested: 0, follow_up: 0, callback_requested: 0, no_answer: 0, not_interested: 0, junk: 0, converted: 0 });
            }
        }

        const outcomes = ["interested", "follow_up", "callback_requested", "no_answer", "not_interested", "junk", "converted"];
        const counts = {};

        // 1. Count Fresh (no interaction yet)
        counts.fresh = await AdvLead.countDocuments({ ...baseQuery, last_interaction_at: { $exists: false } });

        // 2. Count by last_outcome
        await Promise.all(outcomes.map(async (outcome) => {
            counts[outcome] = await AdvLead.countDocuments({ ...baseQuery, last_outcome: outcome });
        }));

        // 3. Total Owned (Simplified)
        counts.total = await AdvLead.countDocuments(baseQuery);

        res.status(200).json(counts);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Add lead from Google Form with Automation (Updated to use reusable function)
router.post("/add-adv-lead", async (req, res) => {
    console.log("Receiving Lead Submission:", JSON.stringify(req.body, null, 2));
    try {
        const lead = await processAndSaveLead(req.body);
        res.status(201).json({ success: true, lead });
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

// GET: Count owned leads for a manager or leader
router.get("/owned-leads-count", async (req, res) => {
    const { userId, role } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    try {
        const roleNorm = (role || "").toLowerCase();
        let query = { 
            owner_id: userId, 
            status: { $nin: ["converted", "closed"] } 
        };

        if (roleNorm === "admin") {
            const count = await AdvLead.countDocuments({ status: "fresh" });
            return res.status(200).json({ count });
        }

        const count = await AdvLead.countDocuments(query);
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
            { $set: { owner_id: managerId, owner_name: managerName, manager_id: managerId, current_owner_role: "manager", status: "assigned_to_manager", assigned_at: new Date() } }
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

        // Find if this person belongs to a team to set team_id
        const team = await AdvTeamStructure.findOne({
            $or: [{ manager_id: assigneeId }, { leaders: assigneeId }]
        });

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
                    team_id: team ? team._id : null,
                    assigned_at: new Date(),
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
            { $set: { owner_id: leaderId, owner_name: leaderName, leader_id: leaderId, current_owner_role: "leader", status: "assigned_to_leader", assigned_at: new Date() } }
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
            { $set: { owner_id: specialistId, owner_name: specialistName, specialist_id: specialistId, current_owner_role: "sr_inside_sales_specialist", status: "assigned_to_specialist", assigned_at: new Date() } }
        );

        res.status(200).json({ success: true, assigned: myLeads.length, message: `${myLeads.length} lead(s) assigned to ${specialistName}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Manual bulk assign specific leads to someone (Checkbox selected)
router.post("/manual-bulk-assign", async (req, res) => {
    const { leadIds, assigneeId, assigneeName, assigneeRole } = req.body;
    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0 || !assigneeId || !assigneeRole) {
        return res.status(400).json({ message: "leadIds, assigneeId, and assigneeRole are required" });
    }
    try {
        // Find if this person belongs to a team to set team_id
        const team = await AdvTeamStructure.findOne({
            $or: [{ manager_id: assigneeId }, { leaders: assigneeId }, { "members.userId": assigneeId }]
        });

        // Map backend roles/statuses
        let dbRole = "manager";
        let dbStatus = "assigned_to_manager";
        const roleNorm = assigneeRole.toLowerCase();

        if (roleNorm.includes("leader")) {
            dbRole = "leader";
            dbStatus = "assigned_to_leader";
        } else if (roleNorm.includes("specialist") || roleNorm.includes("sales")) {
            dbRole = "sr_inside_sales_specialist";
            dbStatus = "assigned_to_specialist";
        }

        const updateData = {
            owner_id: assigneeId,
            owner_name: assigneeName,
            current_owner_role: dbRole,
            status: dbStatus,
            team_id: team ? team._id : null,
            assigned_at: new Date()
        };

        if (dbRole === "manager") updateData.manager_id = assigneeId;
        else if (dbRole === "leader") updateData.leader_id = assigneeId;
        else if (dbRole === "sr_inside_sales_specialist") updateData.specialist_id = assigneeId;

        await AdvLead.updateMany(
            { _id: { $in: leadIds } },
            { $set: updateData }
        );

        res.status(200).json({
            success: true,
            assigned: leadIds.length,
            message: `${leadIds.length} lead(s) manually assigned to ${assigneeName} (${dbRole})`
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Fetch leads based on role with team-based isolation
router.get("/get-adv-leads", async (req, res) => {
    const { role, userId, page = 1, limit = 25, outcome, strictlyOwned, date, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        let baseQuery = {};
        const roleNorm = (role || "").toLowerCase();

        if (roleNorm === "admin") {
            // Admin sees all
        } else if (strictlyOwned === "true") {
            // Strictly owned: only leads where user is the direct owner
            baseQuery = {
                $or: [
                    { owner_id: userId },
                    { current_owner_id: userId }
                ]
            };
        } else if (roleNorm.includes("manager")) {
            const teams = await AdvTeamStructure.find({ manager_id: userId });
            const teamIds = teams.map(t => t._id);
            const teamNames = teams.map(t => t.team_name);
            baseQuery = {
                $or: [
                    { status: "fresh" },
                    { manager_id: userId },
                    { team_id: { $in: teamIds } },
                    { team_name: { $in: teamNames } },
                    { owner_id: userId },
                    { current_owner_id: userId }
                ]
            };
        } else if (roleNorm.includes("leader")) {
            const teams = await AdvTeamStructure.find({ leaders: userId });
            const teamIds = teams.map(t => t._id);
            const teamNames = teams.map(t => t.team_name);
            baseQuery = {
                $or: [
                    { status: "fresh" },
                    { leader_id: userId },
                    { team_id: { $in: teamIds } },
                    { team_name: { $in: teamNames } },
                    { owner_id: userId },
                    { current_owner_id: userId }
                ]
            };
        } else {
            // Check if userId is a valid ObjectId to avoid CastError
            const isValidId = mongoose.Types.ObjectId.isValid(userId);
            if (isValidId) {
                baseQuery = {
                    $or: [
                        { owner_id: userId },
                        { current_owner_id: userId }
                    ]
                };
            } else {
                // For admins with email-based IDs, they usually don't "own" leads in the same way
                // or we search by string fields if they exist. For now, empty or system-wide.
                if (roleNorm === "admin") {
                    baseQuery = {};
                } else {
                    return res.status(200).json({ leads: [], totalPages: 0, totalCount: 0, currentPage: 1 });
                }
            }
        }

        // Apply extra filters if provided
        let query = { ...baseQuery };
        if (status) {
            query.status = status;
        }
        
        if (outcome) {
            if (outcome === "fresh") {
                // Leads with no interaction are considered fresh
                query.last_interaction_at = { $exists: false };
            } else {
                query.last_outcome = outcome;
            }
        }
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            query.$or = [
                { assigned_at: { $gte: startOfDay, $lte: endOfDay } },
                { assigned_at: { $exists: false }, created_at: { $gte: startOfDay, $lte: endOfDay } }
            ];
        }

        const totalCount = await AdvLead.countDocuments(query);
        const leads = await AdvLead.find(query)
            .populate("team_id", "team_name")
            .populate("current_owner_id", "name")
            // CRITICAL SORT:
            // 1. last_interaction_at: 1 (Put Leads with NULL/No interaction at the very top of Page 1, 2, 3...)
            // 2. status: -1 (Among fresh interactions, prioritize those explicitly marked 'fresh' over those assigned to someone)
            // 3. assigned_at: -1 (Most recently assigned leads first)
            // 4. created_at: -1 (Newest Leads of each category first)
            .sort({  assigned_at: -1, created_at: -1 })
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
            status: "assigned_to_team",
            assigned_at: new Date()
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
            { owner_id: managerId, owner_name: managerName, manager_id: managerId, current_owner_role: "manager", status: "assigned_to_manager", assigned_at: new Date() },
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
            { owner_id: leaderId, owner_name: leaderName, leader_id: leaderId, current_owner_role: "leader", status: "assigned_to_leader", assigned_at: new Date() },
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
            { owner_id: specialistId, owner_name: specialistName, specialist_id: specialistId, current_owner_role: "sr_inside_sales_specialist", status: "assigned_to_specialist", assigned_at: new Date() },
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

// PUT: Make fresh (Admin power to reset lead and delete call logs)
router.put("/make-fresh/:id", async (req, res) => {
    try {
        const leadId = req.params.id;
        
        // 1. Reset lead fields
        const updatedLead = await AdvLead.findByIdAndUpdate(leadId, {
            $set: {
                status: "fresh",
                stage: "new",
                last_outcome: null,
                last_interaction_at: null,
                assigned_at: null,
                isLocked: false,
                lockedBy: null,
                lockTime: null,
                // Clear all ownership fields
                owner_id: null,
                owner_name: null,
                manager_id: null,
                leader_id: null,
                specialist_id: null,
                current_owner_id: null,
                current_owner_role: null,
                team_id: null,
                team_name: null
            }
        }, { new: true });

        if (!updatedLead) {
            return res.status(404).json({ message: "Lead not found" });
        }

        // 2. Delete related call activities and followups
        await Promise.all([
            AdvCallActivity.deleteMany({ leadId }),
            AdvFollowup.deleteMany({ leadId })
        ]);

        res.status(200).json({ success: true, message: "Lead has been made fresh and all logs deleted.", lead: updatedLead });
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

// Helper for flexible mapping
const fieldMapping = {
    full_name: ["name", "full_name", "fullname", "student_name", "customer_name", "lead_name", "contact_persona_name"],
    email: ["email", "email_address", "e_mail", "mail", "email_id"],
    phone_number: ["phone", "mobile", "contact", "phone_number", "mobile_number", "contact_number", "whatsapp_number"],
    opted_domain: ["domain", "course", "interest", "opted_domain", "program", "applied_for"],
    education_background: ["qualification", "education", "education_background", "degree"]
};

const normalizeHeader = (header) => {
    if (!header) return "";
    return header.toString().toLowerCase().trim().replace(/[\s\-_]+/g, '_');
};

// POST: Bulk Import Leads (CSV & Excel)
router.post("/bulk-import", upload.single("file"), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { uploaderId, uploaderRole, uploaderName, source } = req.body;

    const processLeads = async (rawLeads) => {
        try {
            let successCount = 0;
            let duplicateCount = 0;
            let errorCount = 0;
            let totalRows = rawLeads.length;

            console.log(`Starting process of ${totalRows} leads...`);

            for (const row of rawLeads) {
                try {
                    // 1. Map fields flexibly
                    let leadData = { extra_fields: {} };
                    
                    Object.keys(row).forEach(key => {
                        const normalizedKey = normalizeHeader(key);
                        let value = row[key];
                        
                        // Basic cleanup for values
                        if (typeof value === 'string') value = value.trim();

                        let mapped = false;
                        for (const [standardField, synonyms] of Object.entries(fieldMapping)) {
                            if (synonyms.includes(normalizedKey)) {
                                leadData[standardField] = value;
                                mapped = true;
                                break;
                            }
                        }

                        if (!mapped) {
                            leadData.extra_fields[normalizedKey] = value;
                        }
                    });

                    // Cast phone to string if it's a number
                    if (leadData.phone_number) {
                        leadData.phone_number = leadData.phone_number.toString();
                    }

                    // Basic validation: must have at least phone_number or full_name
                    if (!leadData.phone_number && !leadData.full_name) {
                        console.log("Skipping row: missing both phone and name", row);
                        errorCount++;
                        continue; 
                    }

                    // Check for existing lead by phone if available
                    let existingLead = null;
                    if (leadData.phone_number) {
                        existingLead = await AdvLead.findOne({ phone_number: leadData.phone_number });
                    }

                    if (!existingLead) {
                        const roleNorm = (uploaderRole || "").toLowerCase();
                        let status = "fresh";
                        let owner_id = uploaderId;
                        let owner_name = uploaderName;
                        let current_owner_role = roleNorm;
                        let manager_id = undefined;
                        let leader_id = undefined;

                        if (roleNorm.includes("manager")) {
                            status = "assigned_to_manager";
                            manager_id = uploaderId;
                        } else if (roleNorm.includes("leader")) {
                            status = "assigned_to_leader";
                            leader_id = uploaderId;
                        } else if (roleNorm === "admin") {
                            status = "fresh";
                            owner_id = undefined;
                            owner_name = undefined;
                            current_owner_role = undefined;
                        }

                        const newLead = new AdvLead({
                            ...leadData,
                            source: source || "Bulk CSV Import",
                            status: status,
                            owner_id,
                            owner_name,
                            manager_id,
                            leader_id,
                            current_owner_role,
                            uploaded_by: uploaderId,
                            uploaded_by_role: uploaderRole,
                            assigned_at: status !== "fresh" ? new Date() : undefined
                        });
                        await newLead.save();
                        successCount++;
                    } else {
                        duplicateCount++;
                    }
                } catch (rowErr) {
                    console.error("Row processing error:", rowErr.message, "Row data:", row);
                    errorCount++;
                }
            }

            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            
            console.log(`Import finished. Success: ${successCount}, Duplicates: ${duplicateCount}, Errors: ${errorCount}`);
            
            res.status(200).json({ 
                message: "Import completed", 
                totalRows,
                successCount, 
                duplicateCount, 
                errorCount 
            });
        } catch (error) {
            console.error("Process leads error:", error);
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            res.status(500).json({ message: error.message });
        }
    };

    const isExcel = req.file.originalname.match(/\.(xlsx|xls)$/i) ||
                    req.file.mimetype.includes("spreadsheetml") ||
                    req.file.mimetype.includes("excel");

    if (isExcel) {
        try {
            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const leads = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
            await processLeads(leads);
        } catch (error) {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
            res.status(500).json({ message: "Failed to parse Excel file: " + error.message });
        }
    } else {
        const leads = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (data) => leads.push(data))
            .on("end", () => processLeads(leads))
            .on("error", (error) => {
                if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                res.status(500).json({ message: "Failed to parse CSV file: " + error.message });
            });
    }
});

// POST: Log a call activity from Leads Book (SR Inside Sales Specialist)
router.post("/log-call-activity", async (req, res) => {
    const {
        leadId, specialistId, specialistName, remark,
        summary, callOutcome, demoScheduleDate, followUpDate, duration
    } = req.body;
    if (!leadId || !specialistId || !callOutcome) {
        return res.status(400).json({ message: "leadId, specialistId, and callOutcome are required" });
    }
    try {
        // Fetch lead and team context
        const lead = await AdvLead.findById(leadId);
        if (!lead) return res.status(404).json({ message: "Lead not found" });

        const team = await AdvTeamStructure.findOne({ "members.userId": specialistId });

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
            duration,
            demoScheduleDate: demoScheduleDate || undefined,
            followUpDate: followUpDate || undefined,
            followUpStatus: followUpDate ? "pending" : undefined
        });
        await activity.save();

        // Update lead status and stage based on outcome
        const statusMap = {
            interested: "in_followup",
            converted: "converted",
            not_interested: "closed",
            no_answer: undefined,
            callback_requested: "in_followup",
            junk: "closed",
            follow_up: "in_followup",
        };

        const stageMap = {
            interested: "interested",
            converted: "converted",
            not_interested: "lost",
            callback_requested: "contacted",
            no_answer: "contacted",
            junk: "lost",
            follow_up: "contacted",
        };

        // Define funnel hierarchy to prevent moving backward
        const stageOrder = ["new", "contacted", "interested", "demo_scheduled", "converted"];

        // Special handling for Demo Scheduled (if date provided)
        let newStage = stageMap[callOutcome];
        if (demoScheduleDate) newStage = "demo_scheduled";

        const newStatus = statusMap[callOutcome];
        const updateFields = { last_outcome: callOutcome };

        if (newStatus) updateFields.status = newStatus;

        // Update stage if it's 'lost' or if it's a forward move in the funnel
        if (newStage) {
            const currentStageIndex = stageOrder.indexOf(lead.stage || "new");
            const newStageIndex = stageOrder.indexOf(newStage);

            if (newStage === "lost" || newStageIndex > currentStageIndex) {
                updateFields.stage = newStage;
            }
        }

        if (demoScheduleDate) updateFields.demo_date = demoScheduleDate;
        
        // NEW: Update last interaction time to push to bottom of list
        updateFields.last_interaction_at = new Date();

        await AdvLead.findByIdAndUpdate(leadId, { $set: updateFields });

        res.status(201).json({ success: true, activity });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Alias for call-log (for mobile app)
router.post("/call-log", async (req, res, next) => {
    // Forward to the log-call-activity handler
    return res.redirect(307, '/api/adv-leads/log-call-activity');
});

// ==========================================
// REMOTE DIALER API ENDPOINTS
// ==========================================

// POST: Web Dashboard requests a remote dial
router.post("/remote-dial-request", async (req, res) => {
    const { specialistId, leadId } = req.body;
    if (!specialistId || !leadId) return res.status(400).json({ message: "specialistId and leadId are required" });

    try {
        // Clear any existing pending requests for this specialist to avoid conflicts
        await RemoteDialQueue.deleteMany({ specialistId });

        const request = new RemoteDialQueue({ specialistId, leadId });
        await request.save();
        res.status(200).json({ success: true, message: "Dial request queued successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: Mobile App polls for new dial requests
router.get("/check-remote-dial", async (req, res) => {
    const { specialistId } = req.query;
    if (!specialistId) return res.status(400).json({ message: "specialistId is required" });

    try {
        const pendingRequest = await RemoteDialQueue.findOne({ specialistId, status: "pending" })
            .populate("leadId", "full_name phone_number opted_domain email")
            .sort({ createdAt: -1 });

        if (pendingRequest) {
            // Update status to prevent duplicate triggers
            pendingRequest.status = "dialing";
            await pendingRequest.save();
            return res.status(200).json({
                hasRequest: true,
                lead: pendingRequest.leadId
            });
        }

        res.status(200).json({ hasRequest: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST: Mobile App acknowledges and clears the queue
router.post("/clear-remote-dial", async (req, res) => {
    const { specialistId } = req.body;
    if (!specialistId) return res.status(400).json({ message: "specialistId is required" });

    try {
        await RemoteDialQueue.deleteMany({ specialistId });
        res.status(200).json({ success: true, message: "Queue cleared" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==========================================

// GET: Fetch call history for a lead
router.get("/call-history/:leadId", async (req, res) => {
    try {
        const calls = await AdvCallActivity.find({ leadId: req.params.leadId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json({ calls });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Upload call recording audio
router.post("/upload-recording", upload.single("audioFile"), async (req, res) => {
    try {
        const { leadId, callActivityId } = req.body;
        if (!req.file) return res.status(400).json({ message: "No audio file uploaded" });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "video", // Cloudinary treats audio as video resource type
            folder: "krutanic_call_recordings"
        });

        // Update call activity with recording URL
        if (callActivityId) {
            await AdvCallActivity.findByIdAndUpdate(callActivityId, {
                $set: { recordingUrl: result.secure_url }
            });
        }

        // Clean up temp file
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

        res.status(200).json({
            success: true,
            recordingUrl: result.secure_url
        });
    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// GET: Fetch upcoming follow-ups for an agent
router.get("/upcoming-followups", async (req, res) => {
    try {
        const { specialistId } = req.query;
        if (!specialistId) return res.status(400).json({ message: "specialistId is required" });

        const now = new Date();
        const followUps = await AdvCallActivity.find({
            specialistId: specialistId,
            callOutcome: "callback_requested",
            followUpDate: { $gte: now },
            followUpStatus: "pending"
        })
            .populate("leadId", "full_name phone_number opted_domain")
            .sort({ followUpDate: 1 });

        res.status(200).json({ followUps });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Fetch today's follow-up count for an agent (Dashboard)
router.get("/followups-today-count", async (req, res) => {
    try {
        const { specialistId } = req.query;
        if (!specialistId) return res.status(400).json({ message: "specialistId is required" });

        // If not a valid ObjectId (like admin email), return 0 count safely
        if (!mongoose.Types.ObjectId.isValid(specialistId)) {
            return res.status(200).json({ count: 0 });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const count = await AdvCallActivity.countDocuments({
            specialistId: specialistId,
            callOutcome: "callback_requested",
            followUpDate: { $gte: startOfDay, $lte: endOfDay },
            followUpStatus: "pending"
        });

        res.status(200).json({ count });
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
    let { role, userId, page = 1, limit = 25 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        let roleNorm = (role || "").toLowerCase();

        // Fallback: If role is missing but userId exists, look up user's designation
        if (!roleNorm && userId) {
            const user = await AdvTeamMember.findById(userId);
            if (user && user.designation) {
                roleNorm = user.designation.toLowerCase();
            }
        }

        let query = {};
        if (roleNorm.includes("manager")) {
            query = { managerId: userId };
        } else if (roleNorm.includes("leader")) {
            query = { leaderId: userId };
        } else {
            return res.status(403).json({ message: "Access denied: Role missing or user not authorized" });
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

// GET: Get specialists in the same team as the leader/manager
router.get("/get-my-team-specialists", async (req, res) => {
    const { userId } = req.query;
    try {
        // Find leader's profile to get their team name
        const leader = await AdvTeamMember.findById(userId);
        if (!leader) return res.status(404).json({ message: "Leader not found" });

        let query = {
            designation: { $regex: /Specialist/i },
            status: "Active"
        };

        if (leader.designation === "ADV Manager") {
            // Managers manage multiple teams
            query.team = { $in: leader.teams || [] };
        } else {
            // Leaders belong to one team
            query.team = leader.team;
        }

        const specialists = await AdvTeamMember.find(query);
        res.status(200).json({ specialists });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// POST: Leader/Manager assigns their leads directly to specialist
router.post("/leader-bulk-assign-specialist", async (req, res) => {
    const { leaderId, specialistId, specialistName, count } = req.body;
    if (!leaderId || !specialistId || !count) {
        return res.status(400).json({ message: "leaderId, specialistId and count are required" });
    }
    try {
        const query = {
            owner_id: leaderId,
            status: { $nin: ["converted", "closed", "assigned_to_specialist"] }
        };
        const myLeads = await AdvLead.find(query)
            .sort({ created_at: 1 })
            .limit(parseInt(count));

        if (myLeads.length === 0) {
            return res.status(404).json({ message: "No leads available to assign" });
        }

        const leader = await AdvTeamMember.findById(leaderId);
        const specialist = await AdvTeamMember.findById(specialistId);

        const leadIds = myLeads.map(l => l._id);
        await AdvLead.updateMany(
            { _id: { $in: leadIds } },
            {
                $set: {
                    owner_id: specialistId,
                    owner_name: specialistName || specialist?.fullname,
                    specialist_id: specialistId,
                    leader_id: leaderId,
                    team_name: specialist?.team || leader?.team,
                    current_owner_role: "sr_inside_sales_specialist",
                    status: "assigned_to_specialist"
                }
            }
        );

        res.status(200).json({
            success: true,
            message: `${myLeads.length} leads assigned to ${specialistName || specialist?.fullname}`
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Fetch unread notifications for a user
router.get("/get-my-notifications", async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    try {
        const notifications = await AdvNotification.find({ userId, isRead: false }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST: Mark notification as read
router.post("/mark-notification-read", async (req, res) => {
    const { notificationId } = req.body;
    try {
        await AdvNotification.findByIdAndUpdate(notificationId, { $set: { isRead: true } });
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET: Alias for my leads (convenience for mobile app)
router.get("/my-leads", async (req, res, next) => {
    req.query.strictlyOwned = "true";
    // We manually trigger the get-adv-leads handler logic
    // In a real app we'd extract the logic to a controller function
    next();
});

// GET: Dialer Queue with Priorities
router.get("/dialer-queue", async (req, res) => {
    const { specialistId } = req.query;
    if (!specialistId) return res.status(400).json({ message: "specialistId is required" });

    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // 1. Get leads with today's follow-ups
        const followUpActivities = await AdvCallActivity.find({
            specialistStringId: specialistId,
            followUpStatus: "pending",
            followUpDate: { $gte: todayStart, $lte: todayEnd }
        }).select("leadId");

        const followUpLeadIds = followUpActivities.map(a => a.leadId.toString());

        // 2. Fetch all active leads for this specialist
        const allLeads = await AdvLead.find({
            $or: [
                { current_owner_id: mongoose.Types.ObjectId.isValid(specialistId) ? specialistId : undefined },
                { specialist_id: specialistId }
            ],
            status: { $nin: ["converted", "closed"] }
        });

        // 3. Sort by Priority: Follow-Ups > In Follow-up > Fresh
        const sortedLeads = allLeads.sort((a, b) => {
            const aIsFollowUp = followUpLeadIds.includes(a._id.toString());
            const bIsFollowUp = followUpLeadIds.includes(b._id.toString());

            if (aIsFollowUp && !bIsFollowUp) return -1;
            if (!aIsFollowUp && bIsFollowUp) return 1;

            const priority = {
                "in_followup": 1,
                "fresh": 2
            };

            const aPriority = priority[a.status] || 99;
            const bPriority = priority[b.status] || 99;

            if (aPriority !== bPriority) return aPriority - bPriority;

            // Final sort by creation date (newest first)
            return new Date(b.created_at) - new Date(a.created_at);
        });

        res.status(200).json(sortedLeads);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET: Fetch single lead details
router.get("/:id", async (req, res) => {
    try {
        const lead = await AdvLead.findById(req.params.id)
            .populate("team_id", "team_name")
            .populate("current_owner_id", "name");
        if (!lead) return res.status(404).json({ message: "Lead not found" });
        res.status(200).json(lead);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
