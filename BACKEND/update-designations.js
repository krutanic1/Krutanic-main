require('dotenv').config();
const mongoose = require('mongoose');

async function updateDB() {
  try {
    await mongoose.connect(process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    
    // Update CreateMedTeam records
    const result = await db.collection('createmedteams').updateMany(
      { designation: 'MED_TEAM' },
      { $set: { designation: 'BOE' } }
    );
    console.log('Updated', result.modifiedCount, 'MED_TEAM to BOE');
    
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

updateDB();
