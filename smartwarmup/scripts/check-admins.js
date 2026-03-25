require('dotenv').config();
const mongoose = require('mongoose');
const AdminMail = require('../src/models/AdminMail');

const checkAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const admins = await AdminMail.find({});
    console.log('Authorized Admin Emails:', admins.map(a => a.email));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkAdmins();
