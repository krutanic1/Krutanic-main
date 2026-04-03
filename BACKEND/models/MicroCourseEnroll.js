const mongoose = require("mongoose");

const MicroCourseEnrollSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "MicroCourse", required: true },
        courseName: { type: String }, // Redundant but useful for reports
        amount: { type: Number, required: true },
        transactionId: { type: String },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
        enrollmentDate: { type: Date, default: Date.now },
        referralCode: { type: String },
        credentialsSent: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        strict: false
    }
);

const MicroCourseEnroll = mongoose.model("microcourses_enrolls", MicroCourseEnrollSchema);

module.exports = MicroCourseEnroll;
