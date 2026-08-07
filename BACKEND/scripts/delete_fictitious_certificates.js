const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

const Certificate = require("../models/Certificate");

async function run() {
    try {
        await mongoose.connect(process.env.DB_NAME || process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        const startDate = new Date("2026-07-30T00:53:39.049+00:00");
        const endDate = new Date();

        console.log(`Looking for certificates created between ${startDate.toISOString()} and ${endDate.toISOString()}`);

        const result = await Certificate.deleteMany({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        });

        console.log(`Deleted ${result.deletedCount} fictitious certificates.`);
    } catch (error) {
        console.error("Error deleting certificates:", error);
    } finally {
        await mongoose.connection.close();
        console.log("Disconnected from MongoDB.");
    }
}

run();
