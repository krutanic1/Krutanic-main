const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://krutanic:L9QnS7kPIcLFq1AL@krutanic.10kcydn.mongodb.net/test?retryWrites=true&w=majority&appName=krutanic')
  .then(async () => {
    const db = mongoose.connection.db;
    
    // Find the BDA record
    const bdas = await db.collection('bdas').find({ email: 'arunk028945@gmail.com' }).toArray();
    console.log('\n--- BDA Record ---');
    bdas.forEach(b => {
        console.log(`Fullname in BDA: "${b.fullname}", email: "${b.email}", id: ${b._id}`);
    });

    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
