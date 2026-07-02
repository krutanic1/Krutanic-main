const mongoose = require('mongoose');
require('dotenv').config();
const AdvLead = require('./models/AdvLead');

async function runMigration() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.DB_NAME);
        console.log("Connected.");

        console.log("Migrating First Call Connected to In Conversation...");
        const updateResult1 = await AdvLead.updateMany(
            { stage: "First Call Connected" },
            { $set: { stage: "In Conversation" } }
        );
        console.log(`Updated ${updateResult1.modifiedCount} leads with old stage.`);

        console.log("Migrating disposition 'In Conversation' to 'Warm'...");
        const updateResult2 = await AdvLead.updateMany(
            { stage: "In Conversation", disposition: "In Conversation" },
            { $set: { disposition: "Warm" } }
        );
        console.log(`Updated ${updateResult2.modifiedCount} leads with old disposition.`);

        console.log("Migration complete.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        mongoose.connection.close();
    }
}

runMigration();
