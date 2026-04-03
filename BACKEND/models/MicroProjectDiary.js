const mongoose = require("mongoose");

const MicroProjectDiarySchema = new mongoose.Schema(
    {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "microusers", required: true },
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "MicroProject", required: true },
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "MicroCourse", required: true },
        entries: [
            {
                dayNumber: { type: Number },
                report: { type: String },
                status: { type: String, enum: ["pending", "completed"], default: "completed" }
            }
        ],
        isCompleted: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

const MicroProjectDiary = mongoose.model("MicroProjectDiary", MicroProjectDiarySchema);

module.exports = MicroProjectDiary;
