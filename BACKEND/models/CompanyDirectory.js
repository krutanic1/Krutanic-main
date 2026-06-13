const mongoose = require('mongoose');

const companyDirectorySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  companyLogo: {
    type: String, // URL to the logo
    default: '',
  },
  industry: {
    type: String,
    required: true,
  },
  companyType: {
    type: String,
    enum: ['Product', 'Service', 'Startup', 'Other'],
    default: 'Other',
  },
  headquarters: {
    type: String,
    required: true,
  },
  careersUrl: {
    type: String,
    required: true,
  },
  fresherFriendly: {
    type: Boolean,
    default: false,
  },
  internshipFriendly: {
    type: Boolean,
    default: false,
  },
  remoteFriendly: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CompanyDirectory', companyDirectorySchema);
