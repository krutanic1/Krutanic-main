const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
        },
        personal: {
            name: { type: String, default: "" },
            email: { type: String, default: "" },
            phone: { type: String, default: "" },
            location: { type: String, default: "" },
            linkedin: { type: String, default: "" },
            github: { type: String, default: "" },
            website: { type: String, default: "" },
            avatar: { type: String, default: "" },
        },
        education: [
            {
                school: String,
                degree: String,
                location: String,
                start: String,
                end: String,
                details: String,
            },
        ],
        experience: [
            {
                title: String,
                company: String,
                location: String,
                start: String,
                end: String,
                bullets: String,
            },
        ],
        projects: [
            {
                name: String,
                techStack: String,
                link: String,
                bullets: String,
            },
        ],
        skills: {
            languages: { type: String, default: "" },
            frameworks: { type: String, default: "" },
            tools: { type: String, default: "" },
            concepts: { type: String, default: "" },
        },
        extra: [
            {
                sectionTitle: String,
                items: String,
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
