const mongoose = require("mongoose");

const AdvLeadSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone_number: { type: String, required: true, unique: true, trim: true },
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
        enum: [
            "Fresh Lead",
            "Attempting Contact",
            "First Call Connected",
            "Demo Conducted",
            "Closed Won",
            "Closed Lost"
        ],
        default: "Fresh Lead",
        required: true
    },
    disposition: {
        type: String,
        required: true,
        default: "New Lead"
    },
    attempt_count: { type: Number, default: 0 },
    last_contacted_at: { type: Date },
    next_followup_at: { type: Date },
    last_note: { type: String },
    stage_updated_at: { type: Date, default: Date.now },
    demo_date: { type: Date },
    expected_payment_date: { type: Date },
    last_outcome: { type: String },
    score: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    lockTime: { type: Date },
    uploaded_by: { type: String }, // User ID of the uploader
    uploaded_by_role: { type: String }, // Role of the uploader
    extra_fields: { type: Map, of: String },
    last_interaction_at: { type: Date }, // Track last worked-on time
    assigned_at: { type: Date }, // NEW: Track when the lead was last assigned
    last_recording_url: { type: String }, // NEW: Store the most recent Cloudinary recording link
    converted: { type: Boolean, default: false }, // For Closed Won
    closed: { type: Boolean, default: false }, // For Closed Won/Lost
    created_at: { type: Date, default: Date.now }
});

// -- PERFORMANCE INDEXES FOR TEAM ANALYTICS --
AdvLeadSchema.index({ owner_id: 1, last_outcome: 1, created_at: -1 });
AdvLeadSchema.index({ created_at: -1 });
AdvLeadSchema.index({ last_outcome: 1 });
AdvLeadSchema.index({ owner_id: 1 });
AdvLeadSchema.index({ status: 1, created_at: -1 });
AdvLeadSchema.index({ owner_id: 1, status: 1 });

// -- PRIVACY TRANSFORMATIONS (Blocks Meta sensitive fields globally) --
const BLACKLIST = [
    "id", "created_time", "ad_id", "ad_name", "adset_id", "adset_name", 
    "campaign_id", "campaign_name", "form_id", "form_name", "is_organic", 
    "platform", "lead_status", "meta_lead_id", "facebook_ad_name", 
    "facebook_campaign_name", "facebook_form_id", "facebook_created_time"
];

AdvLeadSchema.set("toJSON", {
    transform: (doc, ret) => {
        BLACKLIST.forEach(field => delete ret[field]);
        if (ret.extra_fields) {
            BLACKLIST.forEach(field => {
                if (ret.extra_fields[field]) delete ret.extra_fields[field];
            });
        }
        return ret;
    }
});

AdvLeadSchema.set("toObject", {
    transform: (doc, ret) => {
        BLACKLIST.forEach(field => delete ret[field]);
        return ret;
    }
});


const AdvLead = mongoose.models.AdvLead || mongoose.model("AdvLead", AdvLeadSchema);
module.exports = AdvLead;
