const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const AdvTeam = require('../models/CreateAdvTeam');

async function checkUsers() {
    try {
        await mongoose.connect(process.env.DB_NAME);
        const users = await AdvTeam.find({ fullname: { $in: [/chandan pv/i, /sumeetha jangra/i] } });
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkUsers();
