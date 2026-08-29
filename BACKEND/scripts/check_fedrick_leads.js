const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

mongoose.connect(process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const AdvLead = require('../models/AdvLead');
    const fedrickId = '69fdbfadf0ed7ffb66f584ae'; // This is from AdvUser!
    const fedrickTeamId = '69f881fc8cdaed9d794f1b07'; // This is from AdvTeam!
    
    const leads1 = await AdvLead.find({ owner_id: fedrickId });
    const leads2 = await AdvLead.find({ owner_id: fedrickTeamId });
    
    console.log(`Leads with owner_id = ${fedrickId} (AdvUser ID):`, leads1.length);
    console.log(`Leads with owner_id = ${fedrickTeamId} (AdvTeam ID):`, leads2.length);
    
    // Check how many have status: 'assigned_to_manager'
    const managerLeads1 = leads1.filter(l => l.status === 'assigned_to_manager');
    const managerLeads2 = leads2.filter(l => l.status === 'assigned_to_manager');
    
    console.log(`managerLeads1: ${managerLeads1.length}`);
    console.log(`managerLeads2: ${managerLeads2.length}`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
