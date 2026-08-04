const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function resetLeads() {
    try {
        await mongoose.connect(process.env.DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("Connected to DB");
        const AdvLead = require('./models/AdvLead');
        const AdvTask = require('./models/AdvTask');
        
        const emails = ['avanish_sharma@krutanic.org', 'hema_latha@krutanic.org'];
        for (const email of emails) {
            const advTeamMember = await mongoose.connection.db.collection('advteams').findOne({ email: email });
            
            if (advTeamMember) {
                const name = advTeamMember.fullname || advTeamMember.name;
                const id = advTeamMember._id;
                
                console.log(`\n--- Resetting leads for ${name} (${email}) ---`);
                
                // Find all leads assigned to this user
                const leads = await AdvLead.find({
                    $or: [
                        { owner_name: name },
                        { owner_id: id.toString() },
                        { current_owner_id: id }
                    ]
                });
                
                console.log(`Found ${leads.length} leads to delete.`);
                
                const leadIds = leads.map(l => l._id);
                
                // Delete associated tasks
                const taskResult = await AdvTask.deleteMany({ lead_id: { $in: leadIds } });
                console.log(`Deleted ${taskResult.deletedCount} associated tasks.`);
                
                // Delete tasks assigned directly to the user
                const taskResult2 = await AdvTask.deleteMany({ counsellor_id: id });
                console.log(`Deleted ${taskResult2.deletedCount} tasks assigned to the user directly.`);
                
                // Delete the leads
                const leadResult = await AdvLead.deleteMany({ _id: { $in: leadIds } });
                console.log(`Deleted ${leadResult.deletedCount} leads.`);
            } else {
                console.log(`No user found for email ${email}`);
            }
        }
        
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
        console.log("\nFinished resetting leads.");
    }
}

resetLeads();
