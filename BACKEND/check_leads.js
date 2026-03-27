const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    status: String,
    assigned_at: Date,
    last_interaction_at: Date
}, { strict: false });

const AdvLead = mongoose.model('AdvLead', leadSchema, 'advleads');

const mongoUri = 'mongodb+srv://krutanic:L9QnS7kPIcLFq1AL@krutanic.10kcydn.mongodb.net/test?retryWrites=true&w=majority&appName=krutanic';

async function fixLeads() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to DB');
        
        const result = await AdvLead.updateMany(
            { status: 'fresh' },
            { $set: { assigned_at: null, last_interaction_at: null } }
        );
        
        console.log(`Updated ${result.modifiedCount} fresh leads`);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixLeads();
