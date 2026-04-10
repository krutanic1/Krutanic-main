const mongoose = require("mongoose");

const MicroCourseSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        rating: { type: Number, default: 4.5 },
        thumbnail: { type: String },
        price: { type: Number, default: 5000 },
        popular: { type: Boolean, default: false },
        sessions: [
            {
                sessionName: { type: String },
                driveFileId: { type: String }
            }
        ],
        curriculum: [mongoose.Schema.Types.Mixed], 
        longDescription: { type: String } // Clean multi-line description
    },
    {
        timestamps: true,
        strict: false
    }
);

const MicroCourse = mongoose.model("MicroCourse", MicroCourseSchema);

module.exports = MicroCourse;
