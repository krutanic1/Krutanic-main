const mongoose = require("mongoose");

const AdvNotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "AdvUser", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ["lead_assigned", "followup_due", "alert", "conversion", "demo_reminder"],
        default: "alert"
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const AdvNotification = mongoose.models.AdvNotification || mongoose.model("AdvNotification", AdvNotificationSchema);
module.exports = AdvNotification;
