const mongoose = require("mongoose");

const UpcomingCourseSchema = new mongoose.Schema(
    {
        courseName: { type: String, required: true },
        startDate: { type: String },
        enrolledCount: { type: Number, default: 0 },
        isExisting: { type: Boolean, default: false },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "MicroCourse" }
    },
    {
        timestamps: true,
        strict: false
    }
);

const UpcomingCourse = mongoose.model("UpcomingCourse", UpcomingCourseSchema);

module.exports = UpcomingCourse;
