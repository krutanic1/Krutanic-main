const mongoose = require("mongoose");

const PartnerDMSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    status: { type: String, default: "new" }, // new, contacted, resolved
  },
  { timestamps: true }
);

const PartnerDM = mongoose.models.PartnerDM || mongoose.model("PartnerDM", PartnerDMSchema);

module.exports = PartnerDM;
