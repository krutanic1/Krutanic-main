const mongoose = require("mongoose");

const MicroCourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        rating: { type: Number, default: 4.5 },
        thumbnail: { type: String },
        price: { type: Number, default: 5000 },
        sessions: [
            {
                sessionName: { type: String },
                driveFileId: { type: String } // Storing Google Drive File ID
            }
        ]
    },
    {
        timestamps: true,
        strict: false
    }
);

const MicroCourse = mongoose.model("MicroCourse", MicroCourseSchema);

module.exports = MicroCourse;
