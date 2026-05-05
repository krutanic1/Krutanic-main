const mongoose = require("mongoose");

const AdvCallActivitySchema = new mongoose.Schema({
    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvLead", required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvTeamStructure" },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    leaderId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    specialistId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    specialistName: { type: String },
    specialistStringId: { type: String },   // string-based ID from existing ADV Team system
    remark: { type: String },
    summary: { type: String },
    demoScheduleDate: { type: Date },
    reminderSent: { type: Boolean, default: false },
    actionType: { 
        type: String, 
        enum: ["call", "email", "whatsapp", "meeting", "note"], 
        default: "call",
        required: true 
    },
    stage: { type: String, required: true },
    disposition: { type: String, required: true },
    callOutcome: {
        type: String,
    },
    followUpDate: { type: Date },
    followUpStatus: {
        type: String,
        enum: ["pending", "completed", "missed"],
        default: "pending"
    },
    recordingUrl: { type: String },
    duration: { type: Number }, // Call duration in seconds
    createdAt: { type: Date, default: Date.now }
});

AdvCallActivitySchema.index({ leadId: 1 });
AdvCallActivitySchema.index({ specialistId: 1 });
AdvCallActivitySchema.index({ teamId: 1 });
AdvCallActivitySchema.index({ createdAt: 1 });
AdvCallActivitySchema.index({ callOutcome: 1 });
AdvCallActivitySchema.index({ leadId: 1, callOutcome: 1, createdAt: -1 });
AdvCallActivitySchema.index({ specialistId: 1, createdAt: -1 });
AdvCallActivitySchema.index({ callOutcome: 1, createdAt: -1 });


const AdvCallActivity = mongoose.models.AdvCallActivity || mongoose.model("AdvCallActivity", AdvCallActivitySchema);
module.exports = AdvCallActivity;
