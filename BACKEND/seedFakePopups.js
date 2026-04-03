const mongoose = require('mongoose');
require('dotenv').config();
const FakeRegistration = require('./models/FakeRegistration');

const fakeData = [
  { name: "Rahul K.", emailMasked: "rahul****@gmail.com", location: "Bangalore" },
  { name: "Priya S.", emailMasked: "priya****@yahoo.com", location: "Mumbai" },
  { name: "Amit V.", emailMasked: "amit.v****@outlook.com", location: "Delhi" },
  { name: "Sanya M.", emailMasked: "sanya****@gmail.com", location: "Hyderabad" },
  { name: "Vikram R.", emailMasked: "vik****@gmail.com", location: "Pune" },
  { name: "Ananya D.", emailMasked: "ana.d****@gmail.com", location: "Kolkata" },
  { name: "Rohan P.", emailMasked: "rohan****@gmail.com", location: "Chennai" },
  { name: "Neha G.", emailMasked: "neha.g****@gmail.com", location: "Gurgaon" },
  { name: "Sunil T.", emailMasked: "sunil****@gmail.com", location: "Ahmedabad" },
  { name: "Kavya L.", emailMasked: "kavya****@gmail.com", location: "Jaipur" },
  { name: "Arjun B.", emailMasked: "arjun****@gmail.com", location: "Lucknow" },
  { name: "Isha W.", emailMasked: "isha.w****@gmail.com", location: "Indore" },
  { name: "Manish J.", emailMasked: "manish****@gmail.com", location: "Chandigarh" },
  { name: "Prisha N.", emailMasked: "pri.n****@gmail.com", location: "Bhopal" },
  { name: "Tarun S.", emailMasked: "tarun****@gmail.com", location: "Vizag" },
  { name: "Deepak M.", emailMasked: "deep****@gmail.com", location: "Nagpur" },
  { name: "Sneha R.", emailMasked: "sneha****@gmail.com", location: "Thane" },
  { name: "Aman H.", emailMasked: "aman****@gmail.com", location: "Surat" },
  { name: "Riya K.", emailMasked: "riya.k****@gmail.com", location: "Patna" },
  { name: "Dev A.", emailMasked: "dev.a****@gmail.com", location: "Kanpur" }
];

const seedFakePopups = async () => {
  try {
    await mongoose.connect(process.env.DB_NAME);
    console.log("Connected to MongoDB for fake data seeding...");
    
    await FakeRegistration.deleteMany({});
    await FakeRegistration.insertMany(fakeData);
    
    console.log("Seeded 20 fake Indian registrations successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedFakePopups();
