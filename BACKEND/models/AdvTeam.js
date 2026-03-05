const mongoose = require("mongoose");

const AdvTeamSchema = new mongoose.Schema({
    team_name: { type: String, required: true, unique: true },
    manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    leaders: [{ type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" }],
    specialists: [{ type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" }],
    createdAt: { type: Date, default: Date.now }
});

const AdvTeam = mongoose.models.AdvTeam || mongoose.model("AdvTeam", AdvTeamSchema);
module.exports = AdvTeam;
