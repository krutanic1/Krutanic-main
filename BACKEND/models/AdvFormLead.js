const mongoose = require("mongoose");

const AdvFormLeadSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    whatsappNumber: { type: String },
    currentSituation: { type: String },
    preferredLanguages: { type: [String] },
    primaryGoal: { type: String },
    currentChallenge: { type: String },
    interestReason: { type: String },
    domain: { type: String },
    commitmentLevel: { type: String },
    readyToInvest: { type: String },
    startTime: { type: String },
    importanceReason: { type: String },
    connectTime: { type: String },
    paidAgreement: { type: String },
    source: { type: String, default: "Krutanic Advance Form" },
    isAddedToCRM: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

const AdvFormLead = mongoose.models.AdvFormLead || mongoose.model("AdvFormLead", AdvFormLeadSchema);
module.exports = AdvFormLead;
