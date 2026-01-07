const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  startdate: {
    type: String,
    default: "",
  },
  enddate: {
    type: String,
    default: "",
  },
  domain: {
    type: String,
    required: true,
  },
  enrolment: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
    trim: true,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

// ✅ FIX #2: Add Database Indexes for faster queries
// Note: email index already created by unique: true in schema
CertificateSchema.index({ delivered: 1 });
CertificateSchema.index({ domain: 1 });

module.exports = mongoose.model("Certificate", CertificateSchema);