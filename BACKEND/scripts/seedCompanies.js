const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CompanyDirectory = require('../models/CompanyDirectory');

dotenv.config();

const dummyData = [
  {
    companyName: "TechNova Solutions",
    companyLogo: "https://via.placeholder.com/150/0000FF/808080?Text=TechNova",
    industry: "Information Technology",
    companyType: "Service",
    headquarters: "Bangalore, India",
    careersUrl: "https://example.com/careers",
    fresherFriendly: true,
    internshipFriendly: true,
    remoteFriendly: true,
    description: "A leading IT services company specializing in digital transformation.",
    tags: ["IT", "Consulting", "Cloud"]
  },
  {
    companyName: "InnoSoft Systems",
    companyLogo: "https://via.placeholder.com/150/FF0000/FFFFFF?Text=InnoSoft",
    industry: "Software Development",
    companyType: "Product",
    headquarters: "Hyderabad, India",
    careersUrl: "https://example.com/careers",
    fresherFriendly: true,
    internshipFriendly: false,
    remoteFriendly: false,
    description: "Building scalable enterprise software products for the modern world.",
    tags: ["Enterprise", "SaaS", "B2B"]
  },
  {
    companyName: "FinTechify",
    companyLogo: "https://via.placeholder.com/150/00FF00/000000?Text=FinTechify",
    industry: "Finance",
    companyType: "Startup",
    headquarters: "Mumbai, India",
    careersUrl: "https://example.com/careers",
    fresherFriendly: false,
    internshipFriendly: true,
    remoteFriendly: true,
    description: "Disrupting the financial industry with blockchain technology.",
    tags: ["Fintech", "Blockchain", "Crypto"]
  },
  {
    companyName: "EduGrow",
    companyLogo: "https://via.placeholder.com/150/FFFF00/000000?Text=EduGrow",
    industry: "EdTech",
    companyType: "Startup",
    headquarters: "Delhi, India",
    careersUrl: "https://example.com/careers",
    fresherFriendly: true,
    internshipFriendly: true,
    remoteFriendly: true,
    description: "Providing accessible education to everyone, everywhere.",
    tags: ["EdTech", "E-learning", "Education"]
  },
  {
    companyName: "HealthPlus",
    companyLogo: "https://via.placeholder.com/150/FF00FF/FFFFFF?Text=HealthPlus",
    industry: "Healthcare",
    companyType: "Product",
    headquarters: "Pune, India",
    careersUrl: "https://example.com/careers",
    fresherFriendly: false,
    internshipFriendly: false,
    remoteFriendly: false,
    description: "Innovative healthcare solutions for modern hospitals.",
    tags: ["Healthcare", "HealthTech", "Medical"]
  }
];

mongoose.connect(process.env.DB_NAME, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB');
  await CompanyDirectory.deleteMany({});
  await CompanyDirectory.insertMany(dummyData);
  console.log('Seeded data successfully');
  process.exit(0);
}).catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
