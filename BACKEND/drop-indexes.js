const mongoose = require("mongoose");
require("dotenv").config(); // Load the connection string from .env

const dropIndexes = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected successfully!");

        const db = mongoose.connection.db;

        // The specific redundant indexes to drop
        const indexesToDrop = [
            { collection: "advleads", index: "owner_id_1" },
            { collection: "advenrolls", index: "counselor_1" },
            { collection: "advenrolls", index: "createdAt_-1" },
            { collection: "advenrolls", index: "status_1" },
            { collection: "advcallactivities", index: "callOutcome_1" },
            { collection: "advcallactivities", index: "leadId_1" },
            { collection: "advcallactivities", index: "specialistId_1" },
            { collection: "medenrolls", index: "createdAt_-1" },
            { collection: "medenrolls", index: "status_1" }
        ];

        for (const item of indexesToDrop) {
            try {
                console.log(`Attempting to drop index '${item.index}' from collection '${item.collection}'...`);
                await db.collection(item.collection).dropIndex(item.index);
                console.log(`✅ Successfully dropped '${item.index}' from '${item.collection}'`);
            } catch (err) {
                if (err.codeName === "IndexNotFound") {
                    console.log(`ℹ️ Index '${item.index}' already dropped or not found in '${item.collection}'. Skipping.`);
                } else {
                    console.error(`❌ Error dropping '${item.index}' from '${item.collection}':`, err.message);
                }
            }
        }

        console.log("All done! You can close this script.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

dropIndexes();
