const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.DB_NAME);
    
    // Update lead in newenrolls
    await mongoose.connection.db.collection('newenrolls').updateOne(
        { email: 'sushantkumar21616478@gmail.com' },
        { $set: { 
            lead: 'Career Advancement', 
            program: 'Career Advancement [3 Months – Training, Internship & Placement Assistance]'
        } }
    );
    console.log("User's lead set to Career Advancement.");
    process.exit(0);
}

run();
