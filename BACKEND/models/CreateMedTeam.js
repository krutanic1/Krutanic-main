const mongoose = require("mongoose");

const CreateMedTeam = new mongoose.Schema({
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
  target: [{ currentMonth: { type: String }, targetValue: { type: String }, payments: { type: String }, }],
});

const MedTeam = mongoose.model("MedTeam", CreateMedTeam);
module.exports = MedTeam;
