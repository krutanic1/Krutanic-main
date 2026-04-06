const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema(
    {
        collegeName: { type: String, required: true },
        authorizerName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        allowedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "MicroCourse" }],
        studentLimit: { type: Number, default: 0 },
        studentsCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true
    }
);

// Compare password method (simple string comparison as per project patterns, but can be hashed if requested)
CollegeSchema.methods.comparePassword = async function(candidatePassword) {
    return candidatePassword === this.password;
};

const College = mongoose.model("College", CollegeSchema);

module.exports = College;
