const mongoose = require("mongoose");
require("dotenv").config(); // Load the connection string from .env

const createIndexes = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected successfully!");

        const db = mongoose.connection.db;

        // The specific new indexes to create
        const indexesToCreate = [
            { collection: "newenrolls", index: { operationName: 1, createdAt: -1 } },
            { collection: "bdas", index: { status: 1 } },
            { collection: "advleads", index: { current_owner_role: 1, owner_id: 1 } },
            { collection: "advleads", index: { current_owner_role: 1, current_owner_id: 1 } },
            { collection: "advleads", index: { current_owner_id: 1 } }
        ];

        for (const item of indexesToCreate) {
            try {
                console.log(`Attempting to create index ${JSON.stringify(item.index)} on collection '${item.collection}'...`);
                await db.collection(item.collection).createIndex(item.index, { background: true });
                console.log(`✅ Successfully created index on '${item.collection}'`);
            } catch (err) {
                console.error(`❌ Error creating index on '${item.collection}':`, err.message);
            }
        }

        console.log("All done! You can close this script.");
        process.exit(0);
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

createIndexes();
