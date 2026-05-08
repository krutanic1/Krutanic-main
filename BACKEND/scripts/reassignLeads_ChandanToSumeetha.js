const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvTeam = require('../models/CreateAdvTeam');
const AdvLead = require('../models/AdvLead');
const AdvCallActivity = require('../models/AdvCallActivity');
const AdvFollowup = require('../models/AdvFollowup');

async function reassignLeads(dryRun = true) {
    try {
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected to MongoDB");

        const chandan = await AdvTeam.findOne({ fullname: /sumeetha jangra/i });
        const sumeetha = await AdvTeam.findOne({ fullname: /fedrick sarone/i });

        if (!chandan) {
            console.error("User 'sumeetha jangra' not found in AdvTeam collection");
            process.exit(1);
        }
        if (!sumeetha) {
            console.error("User 'fedrick sarone' not found in AdvTeam collection");
            process.exit(1);
        }

        console.log(`Sumeetha ID: ${sumeetha._id} (${sumeetha.fullname})`);
        console.log(`Fedrick ID: ${fedrick._id} (${fedrick.fullname})`);

        const leads = await AdvLead.find({ 
            $or: [
                { owner_id: sumeetha._id.toString() },
                { current_owner_id: sumeetha._id }
            ]
        });

        console.log(`Found ${leads.length} leads assigned to Sumeetha Jangra`);

        let count = 0;
        for (const lead of leads) {
            const latestCall = await AdvCallActivity.findOne({ leadId: lead._id })
                .sort({ createdAt: -1 });

            if (latestCall && (latestCall.callOutcome === 'follow_up' || latestCall.callOutcome === 'no_answer')) {
                console.log(`[${dryRun ? 'DRY RUN' : 'ACTION'}] Processing Lead: ${lead.full_name} (${lead._id}) - Outcome: ${latestCall.callOutcome}`);
                
                if (!dryRun) {
                    const callDel = await AdvCallActivity.deleteMany({ leadId: lead._id });
                    const followDel = await AdvFollowup.deleteMany({ leadId: lead._id });
                    console.log(`   - Deleted ${callDel.deletedCount} calls and ${followDel.deletedCount} follow-ups`);

                    lead.owner_id = sumeetha._id.toString();
                    lead.owner_name = sumeetha.fullname;
                    lead.current_owner_id = sumeetha._id;
                    lead.current_owner_role = sumeetha.designation === "SR Inside Sales Specialist" ? "sr_inside_sales_specialist" : sumeetha.designation;
                    
                    lead.status = "fresh"; 
                    lead.last_outcome = undefined;
                    lead.last_interaction_at = undefined;
                    lead.last_recording_url = undefined;
                    lead.score = 0;
                    lead.assigned_at = new Date();
                    
                    await lead.save();
                }
                count++;
            }
        }

        console.log(`\nSummary:`);
        console.log(`${dryRun ? 'Potential' : 'Successful'} resets and reassignments: ${count}`);
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

const isExecute = process.argv.includes('--execute');
reassignLeads(!isExecute);
