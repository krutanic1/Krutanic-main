const mongoose = require("mongoose");

const MedCourseSchema = new mongoose.Schema(
    {
        title: { type: String },
        description: { type: String },
        modules: [],
        sessions: [],
    },
    {
        timestamps: true,
        strict: false,
    }
);

const MedCourse = mongoose.model("MedCourse", MedCourseSchema);

module.exports = MedCourse;
