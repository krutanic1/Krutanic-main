const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoURI = process.env.DB_NAME || "mongodb+srv://krutanic:Kp6h7s4rJxzzb29j@krutanic.10kcydn.mongodb.net/test?retryWrites=true&w=majority&appName=krutanic";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB for update script");
    
    // Get all courses from createcourses to map title -> id
    const CreateCourse = mongoose.connection.db.collection('createcourses');
    const courses = await CreateCourse.find({}, { projection: { _id: 1, title: 1 } }).toArray();
    
    const courseMap = {};
    for (const course of courses) {
      // Normalize titles slightly for better matching (trim, lowercase maybe? just exact for now)
      courseMap[course.title.trim()] = course._id;
    }
    
    // UI/UX Design -> UI & UX Design
    courseMap["UI/UX Design"] = courseMap["UI & UX Design"];
    // Graphics Design -> Graphic Designing
    courseMap["Graphics Design"] = courseMap["Graphic Designing"];
    
    console.log("Course map:", Object.keys(courseMap).length, "entries mapped.");
    
    const MedEnroll = mongoose.connection.db.collection('medenrolls');
    
    // Find all medenrolls where domainId is null or missing
    const enrollsToUpdate = await MedEnroll.find({ 
      $or: [
        { domainId: null },
        { domainId: { $exists: false } }
      ]
    }).toArray();
    
    console.log(`Found ${enrollsToUpdate.length} medenrolls needing domainId update.`);
    
    let updatedCount = 0;
    
    for (const enroll of enrollsToUpdate) {
      if (!enroll.domain) continue;
      
      const domainName = enroll.domain.trim();
      const mappedId = courseMap[domainName];
      
      if (mappedId) {
        await MedEnroll.updateOne(
          { _id: enroll._id },
          { $set: { domainId: mappedId } }
        );
        updatedCount++;
      } else {
        console.log(`Warning: Could not find domainId for domain name: "${domainName}" in enroll ${enroll._id}`);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} medenrolls with domainId.`);
    process.exit(0);
  })
  .catch(err => {
    console.error("Error:", err);
    process.exit(1);
  });
