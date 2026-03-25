require('dotenv').config({ path: 'c:/Users/tarun/OneDrive/Desktop/Krutanic-main-1/smartwarmup/.env' });
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Connecting to:', process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connection successful!');
    
    const AdminMail = require('./src/models/AdminMail');
    const count = await AdminMail.countDocuments();
    console.log(`AdminMail count: ${count}`);
    
    process.exit(0);
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
