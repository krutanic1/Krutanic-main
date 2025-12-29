const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const JobApplicationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CreateJob",
      required: true,
    },
    title: { type: String },
    company: { type: String },
    status: {
      type: String,
      enum: ["Pending Review", "Under Review", "Selected", "Rejected"], 
      default: "Pending Review", 
    },
  },
  {
    timestamps: true,
  }
);

const JobApplication = mongoose.model("JobApplication", JobApplicationSchema);
module.exports = JobApplication;
