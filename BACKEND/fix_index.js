const mongoose = require("mongoose");
require("dotenv").config();

const uri = "mongodb+srv://tarun:tarunn@krutanic.10kcydn.mongodb.net/test?retryWrites=true&w=majority&appName=krutanic";

mongoose.connect(uri)
    .then(async () => {
        console.log("Connected to MongoDB!");
        try {
            await mongoose.connection.collection("advenrolls").dropIndex("transactionId_1");
            console.log("Successfully dropped transactionId_1 index from advenrolls");
        } catch (error) {
            console.log("Error dropping index (it might not exist):", error.message);
        }

        // Now sync indexes to recreate it with sparse: true
        try {
            const AdvEnroll = require("./models/AdvEnroll");
            await AdvEnroll.syncIndexes();
            console.log("Successfully synced indexes for AdvEnroll");
        } catch (error) {
            console.log("Error syncing indexes:", error.message);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error("Connection error:", err);
        process.exit(1);
    });
