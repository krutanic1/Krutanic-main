const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvTeam = require('../models/CreateAdvTeam');
const AdvLead = require('../models/AdvLead');

async function fixStatus() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected to MongoDB");

        const sumeetha = await AdvTeam.findOne({ fullname: /sumeetha jangra/i });
        if (!sumeetha) {
            console.error("Sumeetha not found");
            process.exit(1);
        }

        // We identify the leads we just moved: owned by Sumeetha and currently status 'fresh'
        const result = await AdvLead.updateMany(
            { 
                owner_id: sumeetha._id.toString(),
                status: "fresh" 
            },
            { $set: { status: "assigned_to_specialist" } }
        );

        console.log(`Successfully updated ${result.modifiedCount} leads to 'assigned_to_specialist' status.`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixStatus();
