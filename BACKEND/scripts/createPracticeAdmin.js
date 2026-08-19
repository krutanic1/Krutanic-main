require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const PracticeUser = require('../models/PracticeUser');

const DB_URL = process.env.DB_NAME;

async function createAdmin() {
  await mongoose.connect(DB_URL);
  console.log('Connected to MongoDB');

  const email = 'admin@practice.com';
  const password = 'admin';

  let user = await PracticeUser.findOne({ email });

  if (user) {
    user.practiceRole = 'admin';
    await user.save();
    console.log(`Updated ${email} to admin.`);
  } else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = await PracticeUser.create({
      name: 'Practice Admin',
      email: email,
      password: hashedPassword,
      practiceRole: 'admin'
    });
    console.log(`Created new admin: ${email} with password: ${password}`);
  }

  await mongoose.disconnect();
}

createAdmin().catch(console.error);
