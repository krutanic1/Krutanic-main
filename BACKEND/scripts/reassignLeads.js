const mongoose = require('mongoose');
const AdvLead = require('../models/AdvLead');
const AdvTeam = require('../models/CreateAdvTeam');
require('dotenv').config({ path: __dirname + '/../.env' });

const fromEmail = "nilasish_goswami@krutanic.org";
const toEmails = [
    "deepti_moyee@krutanic.org",
    "sai_kiran@krutanic.org",
    "helma@krutanic.org",
    "gagan_deepankar@krutanic.org"
];
const stageToMatch = "Attempting Contact";

async function run() {
    try {
        await mongoose.connect(process.env.DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB.");

        const fromUser = await AdvTeam.findOne({ email: fromEmail });
        if (!fromUser) {
            console.error(`From user not found: ${fromEmail}`);
            process.exit(1);
        }

        console.log(`Found fromUser: ${fromUser.fullname} (${fromUser._id})`);

        const toUsers = await AdvTeam.find({ email: { $in: toEmails } });
        if (toUsers.length === 0) {
            console.error("No target users found, exiting.");
            process.exit(1);
        }

        console.log(`Found target users: ${toUsers.map(u => u.email).join(', ')}`);

        // Need to check how 'owner_id' is stored in AdvLead. It might be string or ObjectId.
        // Let's find leads owned by this person
        let leads = await AdvLead.find({ owner_id: fromUser._id.toString(), stage: stageToMatch });
        
        if (leads.length === 0) {
             // Maybe it's stored as ObjectId in current_owner_id instead
             leads = await AdvLead.find({ current_owner_id: fromUser._id, stage: stageToMatch });
        }
        
        console.log(`Found ${leads.length} leads to reassign from ${fromEmail} with stage ${stageToMatch}.`);

        if (leads.length === 0) {
             console.log("No leads found, nothing to do.");
             process.exit(0);
        }

        let updateCount = 0;
        // Distribute round-robin
        for (let i = 0; i < leads.length; i++) {
            const lead = leads[i];
            const targetUser = toUsers[i % toUsers.length];

            lead.old_owners = lead.old_owners || [];
            if (!lead.old_owners.includes(fromUser._id.toString())) {
                lead.old_owners.push(fromUser._id.toString());
            }

            lead.owner_id = targetUser._id.toString(); 
            lead.owner_name = targetUser.fullname; 
            lead.team_name = targetUser.team;
            
            // Also update the modern fields just in case
            lead.current_owner_id = targetUser._id;
            lead.current_owner_role = targetUser.designation;
            
            // Do NOT touch the stage/status
            
            await lead.save();
            updateCount++;
        }

        console.log(`Successfully reassigned ${updateCount} leads.`);

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
        process.exit(0);
    }
}

run();
