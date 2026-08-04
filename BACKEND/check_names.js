const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function getNames() {
    try {
        await mongoose.connect(process.env.DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        const emails = ['avanish_sharma@krutanic.org', 'hema_latha@krutanic.org'];
        for (const email of emails) {
            const advTeamMember = await mongoose.connection.db.collection('advteams').findOne({ email: email });
            console.log(`AdvTeamMember for ${email}:`, advTeamMember);
            
            if (advTeamMember) {
                const name = advTeamMember.fullname || advTeamMember.name;
                const id = advTeamMember._id;
                console.log(`Checking leads for Name: ${name}, ID: ${id}`);
                
                // Let's check AdvLead for this name
                const AdvLead = require('./models/AdvLead');
                const countOwnerName = await AdvLead.countDocuments({ owner_name: name });
                console.log(`AdvLead (owner_name='${name}'): ${countOwnerName}`);
                
                const countOwnerId = await AdvLead.countDocuments({ owner_id: id.toString() });
                console.log(`AdvLead (owner_id string='${id.toString()}'): ${countOwnerId}`);

                // Check MedProLead 
                const MedProLead = require('./models/MedProLead');
                const countMedProOwnerName = await MedProLead.countDocuments({ owner_name: name });
                console.log(`MedProLead (owner_name='${name}'): ${countMedProOwnerName}`);
                const countMedProOwnerId = await MedProLead.countDocuments({ owner_id: id.toString() });
                console.log(`MedProLead (owner_id='${id.toString()}'): ${countMedProOwnerId}`);

                // Check mentorship 
                const Mentorship = require('./models/Mentorship');
                const countMentorshipBda = await Mentorship.countDocuments({ bda: name });
                console.log(`Mentorship (bda='${name}'): ${countMentorshipBda}`);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

getNames();
