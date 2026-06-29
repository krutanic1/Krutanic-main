const mongoose = require('mongoose');

async function run() {
    await mongoose.connect('mongodb+srv://developerkrutanic:Lms_123$@cluster0.p7a0n.mongodb.net/LMS?retryWrites=true&w=majority&appName=Cluster0');
    
    // Get AdvLead model dynamically or just raw collection
    const leads = await mongoose.connection.db.collection('advleads').find({ next_followup_at: { $exists: true, $ne: null } }).sort({ next_followup_at: -1 }).limit(3).toArray();
    
    console.log("Found leads with next_followup_at:");
    leads.forEach(l => {
        console.log(`- ID: ${l._id}, next_followup_at: ${l.next_followup_at}, type: ${typeof l.next_followup_at}`);
    });
    
    process.exit(0);
}
run().catch(console.error);
