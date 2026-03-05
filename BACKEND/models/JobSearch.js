const mongoose = require('mongoose');

const jobSearchSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  status: {
    type: String,
    enum: ['queued', 'processing', 'completed', 'failed', 'partial'],
    default: 'queued',
    index: true
  },
  searchParams: {
    keyword: { type: String, required: true },
    platforms: [{ type: String, enum: ['linkedin', 'indeed', 'unstop'] }],
    location: String,
    experience: String,
    company: String,
    remoteStatus: String,
    resultsPerSite: { type: Number, default: 20 }
  },
  results: [{
    jobId: String,
    jobTitle: String,
    company: String,
    location: String,
    salary: String,
    jobUrl: String,
    platform: String,
    postedDate: Date,
    descriptionSnippet: String,
    employmentType: String,
    remoteStatus: String,
    scrapedAt: { type: Date, default: Date.now }
  }],
  progress: {
    totalPlatforms: { type: Number, default: 0 },
    completedPlatforms: { type: Number, default: 0 },
    currentPlatform: String,
    platformResults: { type: Map, of: Number, default: {} }
  },
  error: {
    message: String,
    code: String,
    failedPlatforms: [String]
  },
  cacheKey: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Auto-delete after 24 hours
  },
  completedAt: Date
});

// Indexes for performance
jobSearchSchema.index({ userId: 1, createdAt: -1 });
jobSearchSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('JobSearch', jobSearchSchema);
