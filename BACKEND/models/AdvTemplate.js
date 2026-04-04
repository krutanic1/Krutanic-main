const mongoose = require("mongoose");

const AdvTemplateSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    createdBy: { type: String, required: true }, // Can be either AdvUser ID or AdvTeam ID
    createdAt: { type: Date, default: Date.now }
});

const AdvTemplate = mongoose.models.AdvTemplate || mongoose.model("AdvTemplate", AdvTemplateSchema);
module.exports = AdvTemplate;
