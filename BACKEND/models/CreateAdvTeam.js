const mongoose = require("mongoose");

const CreateAdvTeam = new mongoose.Schema({
  fullname: { type: String },
  email: { type: String, unique: true, },
  password: { type: String },
  team: { type: String },
  teams: [{ type: String }], // Array of team names for managers managing multiple teams
  designation: { type: String },
  otp: { type: String },
  mailSended: { type: Boolean, default: false },
  Access: { type: Boolean, default: true },
  status: { type: String, default: "Active" },
  smtpEmail: { type: String, default: "" },
  smtpPassword: { type: String, default: "" }, // App Password
  target: [{ currentMonth: { type: String }, targetValue: { type: String }, payments: { type: String }, }],
  
  // Activity Tracking Fields
  lastActiveAt: { type: Date, default: Date.now },
  todayActiveTime: { type: Number, default: 0 }, // Store total seconds for today
  currentScreen: { type: String, default: "Dashboard" }
});

const AdvTeam = mongoose.model("AdvTeam", CreateAdvTeam);
module.exports = AdvTeam;
