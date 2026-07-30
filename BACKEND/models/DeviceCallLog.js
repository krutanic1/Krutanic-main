const mongoose = require("mongoose");

const DeviceCallLogSchema = new mongoose.Schema({
    deviceCallId: { 
        type: String, 
        required: true,
        unique: true
    },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Can be adjusted based on the system's exact user reference
        required: true 
    },
    callType: { 
        type: String, 
        enum: ["INCOMING", "OUTGOING", "MISSED", "REJECTED", "UNKNOWN", "Manual Upload"],
        default: "UNKNOWN"
    },
    contactId: { 
        type: String, 
        default: null 
    },
    contactName: { 
        type: String, 
        default: null 
    },
    durationSeconds: { 
        type: Number, 
        default: 0 
    },
    isRecorded: { 
        type: Boolean, 
        default: false 
    },
    isSyncedFromDevice: { 
        type: Boolean, 
        default: true 
    },
    notes: { 
        type: String, 
        default: null 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    recordingId: { 
        type: String, 
        default: null 
    },
    startedAt: { 
        type: Date 
    },
    syncedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // This will automatically handle createdAt and updatedAt
});

// Indexes for faster querying
DeviceCallLogSchema.index({ userId: 1 });
DeviceCallLogSchema.index({ deviceCallId: 1 });
DeviceCallLogSchema.index({ phoneNumber: 1 });
DeviceCallLogSchema.index({ startedAt: -1 });

const DeviceCallLog = mongoose.models.DeviceCallLog || mongoose.model("DeviceCallLog", DeviceCallLogSchema);
module.exports = DeviceCallLog;
