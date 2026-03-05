const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScrapedJobSchema = new Schema(
  {
    // Core fields from Python scraper
    jobTitle: {
      type: String,
      required: true,
      index: true
    },
    company: {
      type: String,
      required: true,
      index: true
    },
    platform: {
      type: String,
      required: true,
      enum: ['linkedin', 'indeed', 'unstop', 'zip_recruiter'],
      index: true
    },
    jobUrl: {
      type: String,
      required: true,
      unique: true
    },

    // Optional fields
    postedDate: { type: String },
    employmentType: { type: String },
    location: { type: String, index: true },
    remoteStatus: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site', null],
      index: true
    },
    descriptionSnippet: { type: String },
    salary: { type: String },

    // Metadata
    scrapedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastSeenAt: {
      type: Date,
      default: Date.now
    },
    searchKeyword: {
      type: String,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    viewCount: {
      type: Number,
      default: 0
    },
  },
  {
    timestamps: true
  }
);

// Compound indexes for common queries
ScrapedJobSchema.index({ platform: 1, scrapedAt: -1 });
ScrapedJobSchema.index({ jobTitle: 'text', company: 'text', descriptionSnippet: 'text' });

// TTL Index - Auto-delete jobs older than 30 days
ScrapedJobSchema.index(
  { scrapedAt: 1 },
  { expireAfterSeconds: 2592000 }
);

const ScrapedJob = mongoose.model("ScrapedJob", ScrapedJobSchema);
module.exports = ScrapedJob;
