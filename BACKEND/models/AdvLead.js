const mongoose = require("mongoose");

const AdvLeadSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true, unique: true },
    opted_domain: { type: String },
    year_of_passing: { type: String },
    company_name: { type: String },
    role: { type: String }, // Role from the form submission
    education_background: { type: String },
    current_status: { type: String },
    upskilling_ready: { type: String },
    start_timeframe: { type: String },
    source: { type: String, default: "google_form" },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvTeamStructure" },
    current_owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    current_owner_role: { type: String },
    // For existing ADV team system (string-based assignment)
    team_name: { type: String },      // team name from existing getadvteamname
    owner_id: { type: String },       // member _id from existing getadvteam (string)
    owner_name: { type: String },     // member fullname from existing getadvteam
    manager_id: { type: String },
    leader_id: { type: String },
    specialist_id: { type: String },
    status: { type: String, default: "fresh" },
    stage: {
        type: String,
        enum: ["new", "contacted", "interested", "demo_scheduled", "converted", "lost"],
        default: "new"
    },
    last_outcome: { type: String },
    score: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    lockTime: { type: Date },
    uploaded_by: { type: String }, // User ID of the uploader
    uploaded_by_role: { type: String }, // Role of the uploader
    created_at: { type: Date, default: Date.now }
});

const AdvLead = mongoose.models.AdvLead || mongoose.model("AdvLead", AdvLeadSchema);
module.exports = AdvLead;
