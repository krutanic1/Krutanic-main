const mongoose = require("mongoose");

const remoteDialQueueSchema = new mongoose.Schema({
    specialistId: {
        type: String,
        required: true,
        index: true
    },
    leadId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AdvLead",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "dialing", "completed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Auto-delete document after 5 minutes (TTL index)
    }
});

module.exports = mongoose.model("RemoteDialQueue", remoteDialQueueSchema);
