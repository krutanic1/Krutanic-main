const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  role: String,
  source: String,
  pin: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  lastOtpLogin: Date
}, { timestamps: true });

module.exports = mongoose.model("AtdUser", schema);
