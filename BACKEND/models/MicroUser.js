const mongoose = require("mongoose");

const MicroUserSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String },
        password: { type: String, required: true },
        enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "MicroCourse" }],
        courseProgress: { 
            type: Map, 
            of: [Number], 
            default: {} 
        }, // Map of courseId strings to arrays of watched session indices
        isActive: { type: Boolean, default: true },
        collegeId: { type: mongoose.Schema.Types.ObjectId, ref: "College" }
    },
    {
        timestamps: true
    }
);

// Compare password method
MicroUserSchema.methods.comparePassword = async function(candidatePassword) {
    return candidatePassword === this.password;
};

const MicroUser = mongoose.model("microusers", MicroUserSchema);

module.exports = MicroUser;
