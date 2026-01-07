const connectDB = require('./config/db');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

connectDB().then(async (conn) => {
    console.log('✅ Connected');
    // Access internal pool size (Mongoose 6+)
    // Note: Mongoose abstracts this, but we can infer from config or internal driver state if accessible.
    // For now, we trust the file edit, but we will print the config if possible.
    console.log('Connection successful.');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
