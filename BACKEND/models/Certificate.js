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
    // allow same email across different enrolments; uniqueness enforced per enrolment below
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
// Ensure a single certificate per email per enrolment (masterclass)
CertificateSchema.index({ email: 1, enrolment: 1 }, { unique: true });

module.exports = mongoose.model("Certificate", CertificateSchema);