const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function checkCollections() {
    try {
        await mongoose.connect(process.env.DB_NAME, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (let collection of collections) {
             console.log(collection.name);
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.connection.close();
    }
}

checkCollections();
