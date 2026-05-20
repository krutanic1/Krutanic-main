const mongoose = require("mongoose");

const MasterClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: String, required: true },
  end: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true, trim: true },
  pdfstatus: { type: Boolean, default: true },
  status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming" },
  applications: [
    {
      name: String,
      email: String,
      experience: String,
      field: String,
      phone: String,
      appliedAt: { type: Date, default: Date.now }
    }
  ],
  // landing page rich data fields
  subheading: { type: String, default: "" },
  duration: { type: String, default: "" },
  venue: { type: String, default: "Online" },
  registeredCount: { type: String, default: "" },
  rating: { type: String, default: "" },
  level: { type: String, default: "" },
  price: { type: String, default: "" },
  language: { type: String, default: "" },
  certificateAvailable: { type: String, default: "" },
  
  instructorName: { type: String, default: "" },
  instructorDesignation: { type: String, default: "" },
  instructorExpertise: { type: String, default: "" },
  instructorCredibility: { type: String, default: "" },
  instructorExperience: { type: String, default: "" },
  instructorLearnersMentored: { type: String, default: "" },
  instructorRating: { type: String, default: "" },
  instructorSessions: { type: String, default: "" },
  instructorCompanyTags: { type: String, default: "" },
  instructorPhoto: { type: String, default: "" },

  whyAttend: { type: String, default: "" }, // line breaks or comma separated
  whatYouWillLearn: { type: String, default: "" }, // JSON array string
  whoShouldAttend: { type: String, default: "" }, // comma separated
  transformationBefore: { type: String, default: "" }, // comma separated
  transformationAfter: { type: String, default: "" }, // comma separated
  faqs: { type: String, default: "" } // JSON array string
});

const MasterClass = mongoose.model("MasterClass", MasterClassSchema);

module.exports = MasterClass;