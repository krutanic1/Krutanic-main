const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newStudentEnrollSchema = new Schema(
  {
    operationName: {
      type: String,
      default: null
    },
    operationId: {
      type: String,
      default: null
    },
    fullname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    alternativeEmail: {
      type: String,
    },
    phone: {
      type: String,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    program: {
      type: String,
    },
    modeofpayment: {
      type: String,
    },
    counselor: {
      type: String,
    },
    lead: {
      type: String,
    },
    domain: {
      type: String,
    },
    domainId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreateCourse",
    },
    programPrice: {
      type: Number,
    },
    paidAmount: {
      type: Number,
    },
    monthOpted: {
      type: String,
    },
    clearPaymentMonth: {
      type: String,
    },
    remark: [{ type: String }],
    status: { type: String, default: "booked" },
    mailSended: { type: Boolean, default: false },
    onboardingSended: { type: Boolean, default: false },
    userCreated: { type: Boolean, default: false },
    offerlettersended: { type: Boolean, default: false },

    whatsAppNumber: { type: String },
    remainingAmount: { type: Number },
    collegeName: { type: String },
    branch: { type: String },
    aadharNumber: { type: String },
    referFriend: { type: String },
    referRemark: [{ type: String }],
    internshipstartsmonth: { type: String },
    internshipendsmonth: { type: String },
    yearOfStudy: { type: String },
    executiveId: { type: String },
    executive: { type: String },
    languages: [{ type: String }],
    watchedSessions: [{ type: String }],
    selectedProject: { type: String, default: null },
    projectProgress: { type: Map, of: Object, default: {} },
  },
  {
    timestamps: true,
  }
);

// ✅ FIX #2: Add Database Indexes for faster queries
// Note: email index already created by unique: true in schema
newStudentEnrollSchema.index({ status: 1 });
newStudentEnrollSchema.index({ createdAt: -1 });  // Revenue page date filtering
newStudentEnrollSchema.index({ operationId: 1 });
newStudentEnrollSchema.index({ executiveId: 1 });
newStudentEnrollSchema.index({ domain: 1 });
newStudentEnrollSchema.index({ counselor: 1 });  // ✅ NEW: For BDA queries (/databybdaname)
newStudentEnrollSchema.index({ domainId: 1 });   // ✅ NEW: For course lookups/aggregations
newStudentEnrollSchema.index({ status: 1, createdAt: -1 }); // Composite index for filtered queries

// ✅ NEW: Compound index for revenue aggregation queries (improves /getmonthlyrevenue performance)
newStudentEnrollSchema.index({ createdAt: -1, lead: 1, status: 1 });

const NewEnroll = mongoose.model("NewEnroll", newStudentEnrollSchema);
module.exports = NewEnroll;
