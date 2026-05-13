const mongoose = require("mongoose");

const AdvUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "manager", "leader", "sr_inside_sales_specialist", "inside_sales_specialist"],
        required: true
    },
    manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser" },
    team_id: { type: mongoose.Schema.Types.ObjectId, ref: "AdvTeamStructure" },
    status: { type: String, default: "Active" },
    smtpEmail: { type: String, default: "" },
    smtpPassword: { type: String, default: "" }, // App Password
    createdAt: { type: Date, default: Date.now }
});

const AdvUser = mongoose.models.AdvUser || mongoose.model("AdvUser", AdvUserSchema);
module.exports = AdvUser;
