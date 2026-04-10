const mongoose = require("mongoose");

const StudentRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    domainInterested: { type: String, required: true },
    status: { type: String, default: "new" },
  },
  { timestamps: true }
);

const StudentRequest =
  mongoose.models.StudentRequest || mongoose.model("StudentRequest", StudentRequestSchema);

module.exports = StudentRequest;
