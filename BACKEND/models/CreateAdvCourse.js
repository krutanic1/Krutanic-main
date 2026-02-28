const mongoose = require("mongoose");

const CreateAdvCourseSchema = new mongoose.Schema(
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

const CreateAdvCourse = mongoose.model("CreateAdvCourse", CreateAdvCourseSchema);

module.exports = CreateAdvCourse;
