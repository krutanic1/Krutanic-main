const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const AdvTaskSchema = new mongoose.Schema({
    task_id: { type: String, unique: true, default: () => uuidv4() },
    
    // Lead Information
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvLead", required: true },
    lead_name: { type: String, required: true },
    student_mobile: { type: String, required: true },
    
    // Assignment
    counsellor_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser", required: true },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvTeamStructure" }, // Useful for manager team filtering
    
    // Task Specifics
    task_type: {
        type: String,
        enum: [
            "First Call",
            "Follow-up Call",
            "WhatsApp Follow-up",
            "Demo Scheduled",
            "Fee Discussion",
            "Document Collection",
            "Callback",
            "Admission Follow-up",
            "Other"
        ],
        required: true
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    },
    
    // Scheduling
    due_date: { type: Date, required: true }, // Store just the date part (e.g., YYYY-MM-DDT00:00:00.000Z) or full date
    due_time: { type: String, required: true }, // Store time in HH:mm format
    
    // Tracking
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed", "Missed"],
        default: "Pending"
    },
    remarks: { type: String },
    
    // Timestamps
    created_at: { type: Date, default: Date.now },
    completed_at: { type: Date },
    
    // Meta (For audit logs)
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" }, // Who created the task
    updated_by: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" } // Who last modified it
});

// -- PERFORMANCE INDEXES FOR SCALABILITY --
// Highly scalable indexing for dashboard queries
AdvTaskSchema.index({ counsellor_id: 1, due_date: 1, status: 1 });
AdvTaskSchema.index({ team_id: 1, due_date: 1, status: 1 });
AdvTaskSchema.index({ lead_id: 1, status: 1 });
AdvTaskSchema.index({ status: 1, due_date: 1 }); // Global overdue/due today queries
AdvTaskSchema.index({ created_at: -1 });

// Middleware to automatically mark missed tasks
AdvTaskSchema.pre("save", function (next) {
    if (this.isModified("status") && this.status === "Completed" && !this.completed_at) {
        this.completed_at = new Date();
    }
    next();
});

const AdvTask = mongoose.models.AdvTask || mongoose.model("AdvTask", AdvTaskSchema);
module.exports = AdvTask;
