// models/alumni.js
const mongoose = require("mongoose");

const alumniSchema = new mongoose.Schema({
  fullName: String,
  contact: String,
  email: String,
  graduationYear: Number,
  currentCompany: String,
  yearsOfExperience: Number,
  advancedDomains: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Alumni", alumniSchema);