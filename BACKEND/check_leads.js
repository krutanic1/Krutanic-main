const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const AdvLead = require('./models/AdvLead');
const Mentorship = require('./models/Mentorship');
const MedProLead = require('./models/MedProLead');
const AdvFormLead = require('./models/AdvFormLead');
const User = require('./models/User');
const AdvUser = require('./models/AdvUser');

const emails = ['avanish_sharma@krutanic.org', 'hema_latha@krutanic.org'];

async function checkLeads() {
    try {
        await mongoose.connect(process.env.DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to DB");
        
        for (const email of emails) {
            console.log(`Checking leads for email: ${email}`);
            
            // Mentorship
            let countMentorship = await Mentorship.countDocuments({ bda: email });
            console.log(`Mentorship (bda='${email}'): ${countMentorship}`);
            
            // MedProLead
            let countMedProLeadOwnerName = await MedProLead.countDocuments({ owner_name: email });
            console.log(`MedProLead (owner_name='${email}'): ${countMedProLeadOwnerName}`);
            let countMedProLeadEmail = await MedProLead.countDocuments({ email: email });
            console.log(`MedProLead (email='${email}'): ${countMedProLeadEmail}`);

            // MedProLead bdaEmail if exists
            let countMedProBda = await MedProLead.countDocuments({ bdaEmail: email });
            console.log(`MedProLead (bdaEmail='${email}'): ${countMedProBda}`);

            // Let's check AdvUser
            const advUser = await AdvUser.findOne({ email: email });
            if (advUser) {
                console.log(`Found AdvUser ID for ${email}: ${advUser._id}`);
                let countAdvLeadOwnerId = await AdvLead.countDocuments({ current_owner_id: advUser._id });
                console.log(`AdvLead (current_owner_id=${advUser._id}): ${countAdvLeadOwnerId}`);
            } else {
                console.log(`No AdvUser found for ${email}`);
            }
            
            // Check User for bda
            const user = await User.findOne({ email: email });
            if (user) {
                console.log(`Found User ID for ${email}: ${user._id}`);
            } else {
                console.log(`No User found for ${email}`);
            }
            
            // Check if there are other collections
            const collections = await mongoose.connection.db.listCollections().toArray();
            for (let collection of collections) {
                 const col = mongoose.connection.db.collection(collection.name);
                 
                 const countEmail = await col.countDocuments({ email: email });
                 if(countEmail > 0) {
                     console.log(`Collection ${collection.name} has ${countEmail} documents with email: ${email}`);
                 }
                 const countBdaEmail = await col.countDocuments({ bdaEmail: email });
                 if(countBdaEmail > 0) {
                     console.log(`Collection ${collection.name} has ${countBdaEmail} documents with bdaEmail: ${email}`);
                 }
                 const countBda = await col.countDocuments({ bda: email });
                 if(countBda > 0) {
                     console.log(`Collection ${collection.name} has ${countBda} documents with bda: ${email}`);
                 }
                 const countOwnerName = await col.countDocuments({ owner_name: email });
                 if(countOwnerName > 0) {
                     console.log(`Collection ${collection.name} has ${countOwnerName} documents with owner_name: ${email}`);
                 }
                 
                 // if user exists check owner_id
                 if(user) {
                    const countOwner = await col.countDocuments({ owner_id: user._id });
                    if(countOwner > 0) {
                        console.log(`Collection ${collection.name} has ${countOwner} documents with owner_id: ${user._id}`);
                    }
                    const countStrOwner = await col.countDocuments({ owner_id: user._id.toString() });
                    if(countStrOwner > 0) {
                        console.log(`Collection ${collection.name} has ${countStrOwner} documents with owner_id (string): ${user._id}`);
                    }
                 }
                 if(advUser) {
                    const countOwnerId = await col.countDocuments({ current_owner_id: advUser._id });
                    if(countOwnerId > 0) {
                        console.log(`Collection ${collection.name} has ${countOwnerId} documents with current_owner_id: ${advUser._id}`);
                    }
                    const countOwner = await col.countDocuments({ owner_id: advUser._id });
                    if(countOwner > 0) {
                        console.log(`Collection ${collection.name} has ${countOwner} documents with owner_id: ${advUser._id}`);
                    }
                    const countStrOwner = await col.countDocuments({ owner_id: advUser._id.toString() });
                    if(countStrOwner > 0) {
                        console.log(`Collection ${collection.name} has ${countStrOwner} documents with owner_id (string): ${advUser._id}`);
                    }
                 }
            }
        }
    } catch (err) {
        console.error("Error", err);
    } finally {
        mongoose.connection.close();
    }
}

checkLeads();
