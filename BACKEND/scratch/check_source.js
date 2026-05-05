const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvLead = require('../models/AdvLead');

async function checkOldCRMSource() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected to MongoDB");

        const count = await AdvLead.countDocuments({ source: "Old CRM" });
        console.log(`Leads with source 'Old CRM': ${count}`);

        if (count === 0) {
            const sources = await AdvLead.distinct("source");
            console.log("Available sources:", sources);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkOldCRMSource();
