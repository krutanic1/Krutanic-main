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
  delivered:{
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Certificate", CertificateSchema);