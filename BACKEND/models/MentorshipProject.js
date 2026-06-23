const mongoose = require("mongoose");

const MentorshipProjectSchema = new mongoose.Schema(
    {
        courseName: { 
            type: String, 
            required: true,
            unique: true
        },
        projects: {
            type: [String], // Array of 12 strings representing Google Drive links
            default: Array(12).fill('')
        }
    },
    {
        timestamps: true,
    }
);

const MentorshipProject = mongoose.model("MentorshipProject", MentorshipProjectSchema);

module.exports = MentorshipProject;
