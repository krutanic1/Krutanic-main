const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvTeam = require('../models/CreateAdvTeam');
const AdvLead = require('../models/AdvLead');
const AdvFollowup = require('../models/AdvFollowup');

async function reassignLeads(dryRun = true) {
    try {
        console.log(`Starting reassignment... (Dry Run: ${dryRun})`);
        
        // Use DB_NAME from env as connection string
        const connString = process.env.DB_NAME;
        if (!connString) {
            throw new Error("DB_NAME not found in .env");
        }

        await mongoose.connect(connString);
        console.log("Connected to MongoDB");

        const sumeetha = await AdvTeam.findOne({ fullname: /sumeetha jangra/i });
        const fedrick = await AdvTeam.findOne({ fullname: /fedrick sarone/i });

        if (!sumeetha) {
            console.error("Source user 'sumeetha jangra' not found");
            process.exit(1);
        }
        if (!fedrick) {
            console.error("Target user 'fedrick sarone' not found");
            process.exit(1);
        }

        console.log(`Source: ${sumeetha.fullname} (${sumeetha._id})`);
        console.log(`Target: ${fedrick.fullname} (${fedrick._id})`);

        const AdvCallActivity = require('../models/AdvCallActivity');

        const allLeads = await AdvLead.find({
            $or: [
                { owner_id: sumeetha._id.toString() },
                { current_owner_id: sumeetha._id }
            ]
        });

        console.log(`Found ${allLeads.length} total leads assigned to Sumeetha.`);

        let updatedCount = 0;
        let skippedCount = 0;

        for (const lead of allLeads) { // Using a local copy to iterate
            // Check latest call activity
            const latestCall = await AdvCallActivity.findOne({ leadId: lead._id }).sort({ createdAt: -1 });
            
            const lastOutcome = (latestCall?.callOutcome || "").toLowerCase();
            const lastDisp = (latestCall?.disposition || "").toLowerCase();
            
            const isInterested = (lastOutcome.includes('interested') || lastDisp.includes('interested')) && 
                               !(lastOutcome.includes('not interested') || lastDisp.includes('not interested'));

            if (isInterested) {
                console.log(`[SKIP] Lead: ${lead.full_name} (${lead.phone_number}) is Interested. Skipping.`);
                skippedCount++;
                continue;
            }

            console.log(`[${dryRun ? 'DRY RUN' : 'ACTION'}] Reassigning & Resetting: ${lead.full_name} (${lead.phone_number})`);
            
            if (!dryRun) {
                // 1. Delete all history for this lead
                const callDel = await AdvCallActivity.deleteMany({ leadId: lead._id });
                const followDel = await AdvFollowup.deleteMany({ leadId: lead._id });
                console.log(`   - Cleared ${callDel.deletedCount} call logs and ${followDel.deletedCount} follow-ups`);

                // 2. Reset and Reassign Lead
                lead.owner_id = fedrick._id.toString();
                lead.owner_name = fedrick.fullname;
                lead.current_owner_id = fedrick._id;
                lead.current_owner_role = "manager";
                lead.status = "assigned_to_manager";
                lead.stage = "Assigned to Manager";
                lead.disposition = "New Lead";
                lead.attempt_count = 0;
                lead.last_interaction_at = undefined;
                lead.last_outcome = undefined;
                lead.last_note = undefined;
                lead.next_followup_at = undefined;
                lead.demo_date = undefined;
                lead.expected_payment_date = undefined;
                lead.last_contacted_at = undefined;
                
                await lead.save();
            }
            updatedCount++;
        }

        console.log(`\nProcess complete.`);
        console.log(`Skipped (Interested): ${skippedCount}`);
        console.log(`${dryRun ? 'Potential' : 'Actual'} resets/reassignments: ${updatedCount}`);

        process.exit(0);
    } catch (error) {
        console.error("Error during reassignment:", error);
        process.exit(1);
    }
}

// Run the script
// Set to false to actually perform the updates
const isDryRun = process.argv.includes('--execute') ? false : true;
reassignLeads(isDryRun);
