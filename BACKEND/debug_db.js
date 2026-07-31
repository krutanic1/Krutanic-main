const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const collection = mongoose.connection.db.collection('newenrolls');
        const doc = await collection.findOne({});
        console.log('Document keys:', Object.keys(doc || {}));
        console.log('Document:', doc);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

connectDB();
