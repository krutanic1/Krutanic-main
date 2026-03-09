const mongoose = require("mongoose");

const AdvTeamStructureSchema = new mongoose.Schema({
    team_name: { type: String, required: true, unique: true },
    manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    leaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" }],
    specialists: [{ type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" }],
    createdAt: { type: Date, default: Date.now }
});

const AdvTeamStructure = mongoose.models.AdvTeamStructure || mongoose.model("AdvTeamStructure", AdvTeamStructureSchema);
module.exports = AdvTeamStructure;
