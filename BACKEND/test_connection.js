const connectDB = require('./config/db');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly load .env from the current directory
dotenv.config({ path: path.join(__dirname, '.env') });

console.log("Testing connection...");
console.log("DB URI defined:", !!process.env.DB_NAME);

if (!process.env.DB_NAME) {
    console.error("❌ DB_NAME is missing from env!");
    process.exit(1);
}

connectDB().then((conn) => {
    console.log(`✅ Connection successful! Host: ${conn.connection.host}`);
    setTimeout(() => {
        console.log("Exiting test...");
        process.exit(0);
    }, 1000);
}).catch(err => {
    console.error("❌ Connection failed:", err);
    process.exit(1);
});
