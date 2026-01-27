const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const dropIndex = async () => {
    await connectDB();
    try {
        const collection = mongoose.connection.collection('results');
        // List indexes first
        const indexes = await collection.indexes();
        console.log("Current indexes:", indexes);

        // Drop the unique email index if it exists
        // Usually named "email_1"
        const indexName = "email_1";
        if (indexes.find(idx => idx.name === indexName)) {
            await collection.dropIndex(indexName);
            console.log(`Index ${indexName} dropped successfully.`);
        } else {
            console.log(`Index ${indexName} not found.`);
        }

    } catch (err) { // If index doesn't exist, it might throw
        console.error("Error dropping index:", err.message);
    } finally {
        await mongoose.connection.close();
        console.log("Connection closed.");
    }
};

dropIndex();
