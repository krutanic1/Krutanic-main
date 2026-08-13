const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://krutanic:Kp6h7s4rJxzzb29j@krutanic.10kcydn.mongodb.net/test?retryWrites=true&w=majority&appName=krutanic')
.then(async () => {
    const AdvLead = require('./models/AdvLead');
    const emails = [
        'gajbhiy07enikita@gmail.com',
        'vandanbhasvar@gmail.com',
        '12002040701113@mbit.edu.in',
        '24070243035@sig.ac.in',
        'sreevathsa1438@gmail.com',
        '20eg105209@anurag.edu.in',
        'principal@ksit.edu.in'
    ];
    
    const leads = await AdvLead.find({ email: { $in: emails } });
    console.log('Found Leads:', leads.map(l => ({ 
        email: l.email, 
        owner: l.owner_name, 
        current_owner_id: l.current_owner_id, 
        owner_id: l.owner_id 
    })));
    
    const fedrickIdStr = '69f881fc8cdaed9d794f1b07';
    let updatedCount = 0;
    for (const lead of leads) {
        // preserve old owner
        if (lead.owner_id && lead.owner_id !== fedrickIdStr) {
            lead.old_owners.push(lead.owner_id);
            if (lead.old_owners.length > 10) {
                lead.old_owners.shift();
            }
        }
        
        lead.owner_id = fedrickIdStr;
        lead.owner_name = 'fedrick sarone';
        lead.current_owner_id = new mongoose.Types.ObjectId(fedrickIdStr);
        lead.current_owner_role = 'ADV Manager';
        lead.assigned_at = new Date();
        
        await lead.save();
        updatedCount++;
    }
    console.log(`Assigned ${updatedCount} leads to fedrick sarone.`);
    
    mongoose.disconnect();
})
.catch(console.error);
