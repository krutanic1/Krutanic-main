const mongoose = require("mongoose");

const LeadAssignmentSchema = new mongoose.Schema({
    lead_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvLead", required: true },
    from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser", required: true },
    assigned_at: { type: Date, default: Date.now }
});

const LeadAssignment = mongoose.model("LeadAssignment", LeadAssignmentSchema);
module.exports = LeadAssignment;
