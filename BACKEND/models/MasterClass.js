const mongoose = require("mongoose");

// Helper: compute a URL-safe slug from a title
const slugify = (text) => {
  if (!text) return "";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const MasterClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug:  { type: String, index: true, sparse: true }, // pre-computed, auto-set on save
  start: { type: String, required: true },
  end: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String, required: true, trim: true },
  pdfstatus: { type: Boolean, default: true },
  status: { type: String, enum: ["upcoming", "ongoing", "completed"], default: "upcoming", index: true },
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
  instructorLinkedIn: { type: String, default: "" },
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

// Auto-compute slug before every save
MasterClassSchema.pre("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

// Also update slug on findOneAndUpdate / findByIdAndUpdate
MasterClassSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], function (next) {
  const update = this.getUpdate();
  if (update && update.title) {
    update.slug = slugify(update.title);
    if (update.$set && update.$set.title) {
      update.$set.slug = slugify(update.$set.title);
    }
  }
  next();
});

const MasterClass = mongoose.model("MasterClass", MasterClassSchema);

module.exports = MasterClass;