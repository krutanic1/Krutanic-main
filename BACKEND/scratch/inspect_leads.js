const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvLead = require('../models/AdvLead');

async function inspectLeads() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected to MongoDB");

        const userId = "69d4a881cb9305f0d5ecbeb2";
        const leads = await AdvLead.find({ 
            $or: [
                { owner_id: userId },
                { current_owner_id: userId }
            ]
        }).limit(20);

        console.log(`Found ${leads.length} leads for user ${userId}`);
        leads.forEach(l => {
            console.log(`Lead: ${l.full_name} | Source: ${l.source} | Status: ${l.status} | Last Outcome: ${l.last_outcome}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspectLeads();
