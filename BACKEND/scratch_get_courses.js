const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// Try to connect to mongoDB (assuming env var is in BACKEND/.env)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/krutanic";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");
    // Depending on what model it is, I will just list the collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const CreateCourse = mongoose.connection.db.collection('createcourses');
    const courses = await CreateCourse.find({}, { projection: { _id: 1, title: 1 } }).toArray();
    console.log("CreateCourse docs:", JSON.stringify(courses, null, 2));
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
