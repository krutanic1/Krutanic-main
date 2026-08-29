const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

mongoose.connect(process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to DB');
    const AdvLead = require('../models/AdvLead');
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const fedrickId = '69fdbfadf0ed7ffb66f584ae';
    const fedrickName = 'fedrick sarone';
    
    const result = await AdvLead.updateMany(
      { 
        owner_id: '69abf77387a967cb577cea20',
        assigned_at: { $gte: startOfDay, $lte: endOfDay }
      },
      {
        $set: {
          owner_id: fedrickId,
          owner_name: fedrickName,
          current_owner_id: new mongoose.Types.ObjectId(fedrickId)
        }
      }
    );
    
    console.log(`Successfully updated ${result.modifiedCount} leads from tarun to fedrick_sarone.`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
