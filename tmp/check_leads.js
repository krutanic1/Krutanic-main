const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../BACKEND/.env') });

const AdvLead = require('../BACKEND/models/AdvLead');

async function checkLeads() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        console.log('Connected to DB');
        
        const leads = await AdvLead.find({ extra_fields: { $exists: true, $ne: {} } }).limit(5);
        
        console.log(`Found ${leads.length} leads with extra_fields`);
        
        leads.forEach((lead, i) => {
            console.log(`\nLead ${i + 1}: ${lead.full_name}`);
            console.log('Extra Fields Keys:', Array.from(lead.extra_fields.keys()));
            console.log('Extra Fields Values:', lead.extra_fields);
        });

        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkLeads();
