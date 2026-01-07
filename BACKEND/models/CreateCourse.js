const mongoose = require("mongoose");

const CreateCourseSchema = new mongoose.Schema(
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

const CreateCourse = mongoose.model("CreateCourse", CreateCourseSchema);

module.exports = CreateCourse;
