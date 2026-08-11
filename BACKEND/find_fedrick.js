const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://krutanic:Kp6h7s4rJxzzb29j@krutanic.10kcydn.mongodb.net/test?retryWrites=true&w=majority&appName=krutanic')
.then(async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const c of collections) {
        if (c.name === 'advleads') continue; // Skip leads
        
        const col = mongoose.connection.db.collection(c.name);
        // Find any document that matches fedrick case insensitively
        // To do this, we can use a text search or just a simple regex on some common fields
        const doc = await col.findOne({ $or: [
            { name: /fed/i },
            { fullname: /fed/i },
            { email: /fed/i },
            { owner_name: /fed/i },
            { 'member.fullname': /fed/i }
        ] });
        if (doc) {
            console.log(`Found in collection: ${c.name}`);
            console.log(doc);
        }
    }
    console.log('Search complete.');
    mongoose.disconnect();
})
.catch(console.error);
