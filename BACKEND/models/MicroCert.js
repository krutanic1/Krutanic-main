const mongoose = require("mongoose");

const MicroCertSchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "microusers", required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "MicroCourse", required: true },
        courseTitle: { type: String, required: true },
        enrollDate: { type: Date, required: true },
        applyDate: { type: Date, default: Date.now },
        status: { 
            type: String, 
            enum: ["pending", "delivered", "rejected"], 
            default: "pending" 
        },
        certificateId: { type: String, unique: true },
        issueMethod: { type: String, enum: ["auto", "manual"], default: "manual" }
    },
    {
        timestamps: true
    }
);

// Pre-save hook to generate a professional Certificate ID if not present
MicroCertSchema.pre("save", function(next) {
    if (!this.certificateId) {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.certificateId = `DK-${this.courseId.toString().slice(-4).toUpperCase()}-${randomStr}`;
    }
    next();
});

const MicroCert = mongoose.model("MicroCert", MicroCertSchema);

module.exports = MicroCert;
