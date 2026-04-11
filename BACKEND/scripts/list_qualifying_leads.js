const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvTeam = require('../models/CreateAdvTeam');
const AdvLead = require('../models/AdvLead');
const AdvCallActivity = require('../models/AdvCallActivity');

async function listLeads() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        const chandan = await AdvTeam.findOne({ fullname: /chandan pv/i });
        if (!chandan) {
            console.log("Chandan PV not found");
            process.exit(0);
        }

        const leads = await AdvLead.find({ 
            $or: [
                { owner_id: chandan._id.toString() },
                { current_owner_id: chandan._id }
            ]
        });

        console.log(`Leads assigned to Chandan PV: ${leads.length}\n`);
        console.log(`Leads with Latest Call as 'follow_up' or 'no_answer':`);
        console.log(`--------------------------------------------------`);

        let count = 0;
        for (const lead of leads) {
            const latestCall = await AdvCallActivity.findOne({ leadId: lead._id })
                .sort({ createdAt: -1 });

            if (latestCall && (latestCall.callOutcome === 'follow_up' || latestCall.callOutcome === 'no_answer')) {
                console.log(`${count + 1}. Name: ${lead.full_name.padEnd(20)} | Outcome: ${latestCall.callOutcome.padEnd(12)} | Date: ${latestCall.createdAt.toISOString().split('T')[0]}`);
                count++;
            }
        }

        console.log(`--------------------------------------------------`);
        console.log(`Total Qualifying Leads: ${count}`);
        
        const freshCount = await AdvLead.countDocuments({ 
            owner_id: chandan._id.toString(),
            last_interaction_at: { $exists: false }
        });
        console.log(`Truly 'Fresh' Leads (never called): ${freshCount}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listLeads();
