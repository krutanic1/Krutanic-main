const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvLead = require('../models/AdvLead');
const AdvCallActivity = require('../models/AdvCallActivity');
const AdvFollowup = require('../models/AdvFollowup');
const AdvTeam = require('../models/CreateAdvTeam');
const AdvUser = require('../models/AdvUser');

/**
 * SCRIPT: Reset Data Science & Data Analytics Leads
 * 
 * Objective: 
 * 1. Find all leads in 'Data Science' or 'Data Analytics' domains.
 * 2. Wipe their call logs (AdvCallActivity) and follow-ups (AdvFollowup).
 * 3. Reset their status to 'fresh' and clear interaction history.
 * 4. Assign them to a new owner.
 */

async function resetAndReassignLeads(targetOwnerId, dryRun = true) {
    try {
        const dbUri = process.env.DB_NAME || process.env.MONGODB_URI;
        if (!dbUri) {
            console.error("❌ MONGODB_URI or DB_NAME not found in .env");
            process.exit(1);
        }

        await mongoose.connect(dbUri);
        console.log("✅ Connected to MongoDB");

        if (!targetOwnerId) {
            console.error("❌ Error: Please provide a TARGET_OWNER_ID");
            process.exit(1);
        }

        // Try to find the user in both models to get their full details
        let targetUser = await AdvTeam.findById(targetOwnerId) || await AdvUser.findById(targetOwnerId);
        
        if (!targetUser) {
            console.error(`❌ User with ID ${targetOwnerId} not found in AdvTeam or AdvUser collections.`);
            process.exit(1);
        }

        const targetName = targetUser.fullname || targetUser.name;
        const targetRole = targetUser.designation || targetUser.role;

        console.log(`🎯 Targeting Owner: ${targetName} (${targetOwnerId}) - Role: ${targetRole}`);

        // Search for Data Science and Data Analytics leads
        // Using regex to catch variations like "Data Science leds" or "data analytics"
        const domainRegex = /Data Science|Data Analytics/i;
        
        const leads = await AdvLead.find({
            opted_domain: domainRegex
        });

        console.log(`🔍 Found ${leads.length} leads in Data Science/Analytics domains.`);

        if (leads.length === 0) {
            console.log("ℹ️ No leads found to process.");
            process.exit(0);
        }

        let resetCount = 0;

        for (const lead of leads) {
            console.log(`\n[${dryRun ? 'DRY RUN' : 'EXECUTING'}] Processing Lead: ${lead.full_name} (${lead.opted_domain})`);
            
            if (!dryRun) {
                // 1. Wipe Call Logs
                const callRes = await AdvCallActivity.deleteMany({ leadId: lead._id });
                
                // 2. Wipe Follow-ups
                const followRes = await AdvFollowup.deleteMany({ leadId: lead._id });

                console.log(`   - Deleted ${callRes.deletedCount} call logs`);
                console.log(`   - Deleted ${followRes.deletedCount} follow-ups`);

                // 3. Reset Lead Assignment and Status
                lead.owner_id = targetOwnerId.toString();
                lead.owner_name = targetName;
                lead.current_owner_id = mongoose.Types.ObjectId.isValid(targetOwnerId) ? new mongoose.Types.ObjectId(targetOwnerId) : undefined;
                lead.current_owner_role = targetRole === "SR Inside Sales Specialist" ? "sr_inside_sales_specialist" : targetRole;
                
                lead.status = "assigned_to_manager";
                lead.stage = "new";
                lead.last_outcome = undefined;
                lead.last_interaction_at = undefined;
                lead.last_recording_url = undefined;
                lead.score = 0;
                lead.assigned_at = new Date();

                await lead.save();
                console.log(`   - Lead reset and assigned to ${targetName}`);
            } else {
                const callCount = await AdvCallActivity.countDocuments({ leadId: lead._id });
                const followCount = await AdvFollowup.countDocuments({ leadId: lead._id });
                console.log(`   - Would delete ${callCount} calls and ${followCount} follow-ups`);
                console.log(`   - Would reassign to ${targetName}`);
            }
            resetCount++;
        }

        console.log(`\n-----------------------------------------`);
        console.log(`✅ Summary:`);
        console.log(`Total Leads Processed: ${resetCount}`);
        console.log(`Mode: ${dryRun ? 'DRY RUN (No changes made)' : 'EXECUTION COMPLETED'}`);
        if (dryRun) console.log(`👉 Run with --execute flag to apply changes.`);
        console.log(`-----------------------------------------`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Script Error:", err);
        process.exit(1);
    }
}

// Usage: node resetDataScienceLeads.js <OWNER_ID> [--execute]
const args = process.argv.slice(2);
const targetId = args.find(arg => !arg.startsWith('--'));
const isExecute = args.includes('--execute');

if (!targetId) {
    console.log("\n❌ Usage: node resetDataScienceLeads.js <TARGET_OWNER_ID> [--execute]");
    console.log("Example: node resetDataScienceLeads.js 66b1a... --execute\n");
    process.exit(1);
}

resetAndReassignLeads(targetId, !isExecute);
