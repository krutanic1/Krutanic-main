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
    deviceCallType: {
        type: String,
        enum: ["INCOMING", "OUTGOING", "MISSED", "REJECTED", "UNKNOWN", "Manual Upload", null],
        default: null
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


AdvCallActivitySchema.index({ teamId: 1 });
AdvCallActivitySchema.index({ createdAt: 1 });

AdvCallActivitySchema.index({ leadId: 1, callOutcome: 1, createdAt: -1 });
AdvCallActivitySchema.index({ specialistId: 1, createdAt: -1 });
AdvCallActivitySchema.index({ callOutcome: 1, createdAt: -1 });
AdvCallActivitySchema.index({ specialistId: 1, followUpDate: 1 });

// --- Mongoose Hooks for Auto-Task Creation from Call Logs (Permanent Fix) ---
AdvCallActivitySchema.post("save", async function(doc) {
    if (!doc.followUpDate) return;

    try {
        const AdvTask = mongoose.models.AdvTask || require("./AdvTask");
        const AdvLead = mongoose.models.AdvLead || require("./AdvLead");

        // Prevent duplicate tasks for the same followUpDate on this lead
        const existingTask = await AdvTask.findOne({ 
            lead_id: doc.leadId, 
            task_type: "Follow-up Call", 
            due_date: { 
                $gte: new Date(new Date(doc.followUpDate).setHours(0,0,0,0)), 
                $lt: new Date(new Date(doc.followUpDate).setHours(23,59,59,999)) 
            } 
        });

        if (existingTask) return;

        const lead = await AdvLead.findById(doc.leadId);
        if (!lead) return;

        const dueDateTime = new Date(doc.followUpDate);
        const dueTimeString = `${String(dueDateTime.getHours()).padStart(2, '0')}:${String(dueDateTime.getMinutes()).padStart(2, '0')}`;
        
        await new AdvTask({
            lead_id: doc.leadId,
            lead_name: lead.full_name || lead.owner_name || "New Lead",
            student_mobile: lead.phone_number,
            counsellor_id: doc.specialistId || lead.owner_id || lead.current_owner_id,
            team_id: doc.teamId || lead.team_id,
            task_type: doc.actionType === 'whatsapp' ? "WhatsApp Follow-up" : "Follow-up Call",
            priority: "High",
            due_date: dueDateTime,
            due_time: dueTimeString,
            remarks: doc.remark || doc.summary || "Auto-generated Follow-up Task from Call Log.",
            status: "Pending",
            created_at: new Date()
        }).save();
    } catch (err) {
        console.error("Failed to auto-create follow-up task from call log:", err);
    }
});
// ---------------------------------------------------------------------------------

const AdvCallActivity = mongoose.models.AdvCallActivity || mongoose.model("AdvCallActivity", AdvCallActivitySchema);
module.exports = AdvCallActivity;
