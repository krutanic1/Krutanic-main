const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const emails = [
  "sagardhangar999@gmail.com",
  "ashchoudhary2001@gmail.com",
  "sanjanakulkarni2995@gmail.com",
  "mpriyanshu123456789@gmail.com",
  "sk47official@gmail.com",
  "kashish6023799@gmail.com",
  "acharyapiyush157@gmail.com",
  "abhitheultimateone@gmail.com",
  "Knithya.aero@gmail.com",
  "parshwonath98@gmail.com",
  "amstranger0408@gmail.com",
  "deepics.9738@gmail.com"
];

mongoose.connect(process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const AdvLead = require('../models/AdvLead');
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    console.log("Checking Leads:\\n");
    
    for (const email of emails) {
      const lead = await AdvLead.findOne({ email: new RegExp('^' + email + '$', 'i') });
      if (!lead) {
        console.log(`[NOT FOUND] ${email}`);
      } else {
        const createdAt = lead.createdAt || lead._id.getTimestamp();
        const isToday = createdAt >= startOfDay;
        console.log(`[${isToday ? 'TODAY' : 'OLD'}] ${email} (Created At: ${createdAt.toISOString()})`);
      }
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
