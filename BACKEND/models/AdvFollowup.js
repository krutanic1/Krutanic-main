const mongoose = require("mongoose");

const AdvFollowupSchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvLead", required: true },
    specialistId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser", required: true },
    followupDate: { type: Date, required: true },
    taskType: { 
        type: String, 
        enum: ["call", "demo", "follow-up"], 
        default: "call",
        required: true 
    },
    note: { type: String },
    status: {
        type: String,
        enum: ["pending", "completed", "missed"],
        default: "pending"
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    createdAt: { type: Date, default: Date.now }
});

const AdvFollowup = mongoose.models.AdvFollowup || mongoose.model("AdvFollowup", AdvFollowupSchema);
module.exports = AdvFollowup;
