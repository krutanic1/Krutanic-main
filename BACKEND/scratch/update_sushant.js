const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
    await mongoose.connect(process.env.DB_NAME);
    
    // Update user to have advance=true
    await mongoose.connection.db.collection('users').updateOne(
        { email: 'sushantkumar21616478@gmail.com' },
        { $set: { advance: true } }
    );
    console.log("User's advance flag set to true.");

    // Check examples of Career Advancement leads
    const example = await mongoose.connection.db.collection('newenrolls').findOne({
        program: /Career Advancement/i,
        lead: { $ne: 'SGFL' }
    });
    console.log('Example of Career Advancement lead:', example ? example.lead : 'None found');
    
    // If CAFL or something similar is used, we can update it too. Let's see what is used.
    process.exit(0);
}

run();
