const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CreateCourse",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },
        // roadmap is an object where keys are week numbers (1-24)
        // and values are { phase: string, tasks: [string] }
        roadmap: {
            type: Map,
            of: new mongoose.Schema({
                phase: { type: String, required: true },
                tasks: [{ type: String, required: true }],
            }, { _id: false }),
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
