const mongoose = require("mongoose");

const MicroProjectSchema = new mongoose.Schema(
    {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "MicroCourse", required: true },
        projectName: { type: String, required: true },
        description: { type: String },
        lockAfterSessions: { type: Number, required: true }, // Sessions required before this project
        days: [
            {
                dayNumber: { type: Number },
                topic: { type: String },
                description: { type: String }
            }
        ]
    },
    {
        timestamps: true
    }
);

const MicroProject = mongoose.model("MicroProject", MicroProjectSchema);

module.exports = MicroProject;
