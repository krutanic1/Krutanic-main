const mongoose = require('mongoose');
require('dotenv').config();
const MicroCourse = require('./models/MicroCourse');

const seedCourses = [
  {
    _id: "660999999999999999999901",
    title: "Full Stack Web Development",
    description: "Master the MERN stack and build enterprise-grade applications.",
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    price: 4999,
    sessions: [
      { sessionName: "Introduction to React", driveFileId: "1xYz2A_Sample_ID_1" },
      { sessionName: "Node.js & Express", driveFileId: "1xYz2B_Sample_ID_2" }
    ]
  },
  {
    _id: "660999999999999999999902",
    title: "Data Analytics Bootcamp",
    description: "Turn raw data into actionable business insights with Python and SQL.",
    rating: 4.8,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    price: 5999,
    sessions: [
      { sessionName: "Pandas & NumPy", driveFileId: "1xYz2C_Sample_ID_3" }
    ]
  },
  {
    _id: "660999999999999999999903",
    title: "AI & Machine Learning",
    description: "Build and deploy neural networks and generative AI models.",
    rating: 4.9,
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
    price: 6999,
    sessions: []
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.DB_NAME);
    console.log("Connected to MongoDB for seeding...");
    
    // Clear existing
    await MicroCourse.deleteMany({});
    
    // Insert new
    const createdCourses = await MicroCourse.insertMany(seedCourses);
    console.log(`Seeded ${createdCourses.length} courses successfully!`);
    
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
