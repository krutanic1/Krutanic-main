const mongoose = require("mongoose");

const CreateHR = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String },
  designation: { type: String, default: 'HR Manager' },
  otp: { type: String },
  mailSended: { type: Boolean, default: false },
  Access: { type: Boolean, default: true },
  status: { type: String, default: "Active" }
});

const HR = mongoose.model("HR", CreateHR);
module.exports = HR;
