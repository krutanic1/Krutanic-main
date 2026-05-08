const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvLead = require('../models/AdvLead');

async function debugSunandita() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        const sunanditaId = '69f9e96f5f77c94f0c2a7a96';
        
        const total = await AdvLead.countDocuments({ 
            $or: [
                { owner_id: sunanditaId },
                { current_owner_id: sunanditaId }
            ]
        });

        const stages = await AdvLead.aggregate([
            { 
                $match: { 
                    $or: [
                        { owner_id: sunanditaId },
                        { current_owner_id: sunanditaId }
                    ]
                } 
            },
            { $group: { _id: "$stage", count: { $sum: 1 } } }
        ]);

        const dispositions = await AdvLead.aggregate([
            { 
                $match: { 
                    $or: [
                        { owner_id: sunanditaId },
                        { current_owner_id: sunanditaId }
                    ]
                } 
            },
            { $group: { _id: "$disposition", count: { $sum: 1 } } }
        ]);

        const AdvCallActivity = require('../models/AdvCallActivity');
        const leadsTouched = await AdvCallActivity.distinct('leadId', { specialistId: sunanditaId });
        
        const currentOwners = await AdvLead.aggregate([
            { $match: { _id: { $in: leadsTouched } } },
            { $group: { _id: "$owner_name", count: { $sum: 1 } } }
        ]);

        console.log(`Current Owners of the ${leadsTouched.length} leads Sunandita has interacted with:`);
        console.log(JSON.stringify(currentOwners, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugSunandita();
