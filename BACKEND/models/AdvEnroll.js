const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const advEnrollSchema = new Schema(
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
    phone: {
      type: String,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
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
      ref: "CreateAdvCourse",
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
    experience: { type: String },
    paymentPlan: { type: String },
    referFriend: { type: String },
    referRemark: [{ type: String }],
    yearOfPassingOut: { type: String },
    internshipstartsmonth: { type: String },
    internshipendsmonth: { type: String },
    executiveId: { type: String },
    executive: { type: String },
    languages: [{ type: String }],
    companyName: { type: String },
    role: { type: String },
    watchedSessions: [{ type: String }],
    selectedProject: { type: String, default: null },
    projectProgress: { type: Map, of: Object, default: {} },
    batchTiming: { type: String },
  },
  {
    timestamps: true,
  }
);

// Database Indexes for faster queries
advEnrollSchema.index({ status: 1 });
advEnrollSchema.index({ createdAt: -1 });
advEnrollSchema.index({ operationId: 1 });
advEnrollSchema.index({ executiveId: 1 });
advEnrollSchema.index({ domain: 1 });
advEnrollSchema.index({ counselor: 1 });
advEnrollSchema.index({ domainId: 1 });
advEnrollSchema.index({ status: 1, createdAt: -1 });
advEnrollSchema.index({ createdAt: -1, lead: 1, status: 1 });
advEnrollSchema.index({ counselor: 1, createdAt: -1 });


const AdvEnroll = mongoose.model("AdvEnroll", advEnrollSchema);
module.exports = AdvEnroll;
