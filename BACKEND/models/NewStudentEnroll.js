const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newStudentEnrollSchema = new Schema(
  {
    operationName: {
      type: String,
      default:null
    },
    operationId: {
      type: String,
      default:null
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
    lead:{
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

    whatsAppNumber:{type:String},
    remainingAmount:{type:String},
    collegeName:{type:String},
    branch:{type:String},
    aadharNumber:{type:String},
    referFriend:{type:String},
    referRemark:[{type:String}],
    internshipstartsmonth:{type:String},
    internshipendsmonth:{type:String},
    yearOfStudy:{type:String},
    executiveId:{type:String},
    executive:{type:String},
  },
  {
    timestamps: true,
  },


);

const NewEnroll = mongoose.model("NewEnroll", newStudentEnrollSchema);
module.exports = NewEnroll;
