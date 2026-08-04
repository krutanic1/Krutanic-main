const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function unassignLeads() {
    try {
        console.log("Connecting to DB...");
        await mongoose.connect(process.env.DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log("✅ Connected to DB");
        const AdvLead = require('./models/AdvLead');
        const AdvTask = require('./models/AdvTask');
        
        const emails = ['avanish_sharma@krutanic.org', 'hema_latha@krutanic.org'];
        let totalUnassigned = 0;
        let totalTasksDeleted = 0;

        for (const email of emails) {
            const advTeamMember = await mongoose.connection.db.collection('advteams').findOne({ email: email });
            
            if (advTeamMember) {
                const name = advTeamMember.fullname || advTeamMember.name;
                const id = advTeamMember._id;
                
                console.log(`\n--- Unassigning leads for ${name} (${email}) ---`);
                
                // Find all leads assigned to this user
                const leads = await AdvLead.find({
                    $or: [
                        { owner_name: name },
                        { owner_id: id.toString() },
                        { current_owner_id: id }
                    ]
                });
                
                console.log(`Found ${leads.length} leads to unassign.`);
                
                const leadIds = leads.map(l => l._id);
                
                // Delete associated tasks since they are unassigned
                if (leadIds.length > 0) {
                    const taskResult = await AdvTask.deleteMany({ lead_id: { $in: leadIds } });
                    console.log(`Deleted ${taskResult.deletedCount} associated tasks.`);
                    totalTasksDeleted += taskResult.deletedCount;
                    
                    // Unassign and make fresh
                    const updateResult = await AdvLead.updateMany(
                        { _id: { $in: leadIds } },
                        {
                            $set: {
                                status: "fresh",
                                stage: "Fresh Lead",
                                disposition: "New Lead",
                                attempt_count: 0,
                                countrnr: 0,
                                score: 0
                            },
                            $unset: {
                                owner_id: "",
                                owner_name: "",
                                current_owner_id: "",
                                current_owner_role: "",
                                team_name: "",
                                team_id: "",
                                manager_id: "",
                                leader_id: "",
                                specialist_id: "",
                                last_note: "",
                                last_outcome: "",
                                next_followup_at: "",
                                expected_payment_date: "",
                                assigned_at: ""
                            }
                        }
                    );
                    console.log(`Successfully unassigned and reset ${updateResult.modifiedCount} leads.`);
                    totalUnassigned += updateResult.modifiedCount;
                }
            } else {
                console.log(`No user found for email ${email}`);
            }
        }
        
        console.log(`\n✅ Finished! Unassigned a total of ${totalUnassigned} leads and deleted ${totalTasksDeleted} old tasks.`);
        
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        mongoose.connection.close();
    }
}

unassignLeads();
