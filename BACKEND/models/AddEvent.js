const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  answer: { type: String, required: true },
  coin: { type: Number, default: 1 },
});

const AddEventSchema = new mongoose.Schema(
  {
    /* ================= CORE EVENT ================= */

    title: { type: String, required: true },

    slug: {
      type: String,
      required: true,
      unique: true, // SEO URL
      lowercase: true,
    },

    category: {
      type: String,
      enum: [
        "AI",
        "Web Development",
        "Cyber Security",
        "Business Analytics",
        "Full Stack Web Development",
        "Android App Development",
        "Artificial Intelligence",
        "Machine Learning",
        "Data Science",
        "Data Analytics",
        "UI/UX Design",
        "DevOps",
        // "Automation Testing",
        "Finance",
        "Human Resource",
        "Digital Marketing",
        "Stock Marketing",
        // "Supply Chain Management",
        // "Fintech",
        "Graphics Design",
        "Embedded System",
        "Cloud Computing",
        "IOT & Robotics",
        // "Nano Technology & Genetic Engineering",
        // "Psychology",
        "Auto Cad"
      ],
      required: true,
    },

    type: {
      type: String,
      default: "MCQ", // MCQ / Hackathon / Workshop
    },

    mode: {
      type: String,
      enum: ["online", "offline", "hybrid"],
      default: "online",
    },

    location: {
      type: String,
      default: "Online",
    },

    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },

    isFree: {
      type: Boolean,
      default: true,
    },

    // URL for the event image (banner/thumbnail)
    image: {
      type: String,
    },

    /* ================= DATES & TIME ================= */

    startDate: { type: Date, required: true },
    endDate: { type: Date },

    startTime: { type: String }, // "18:00"
    endTime: { type: String },   // "19:30"

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    /* ================= CONTENT ================= */

    shortDescription: {
      type: String,
      maxlength: 200, // event card text
    },

    fullDescription: {
      type: String, // event detail page
    },

    eligibility: {
      type: String,
      default: "Open for all students",
    },

    benefits: [
      {
        type: String, // Certificate, Ranking, Exposure
      },
    ],

    /* ================= REGISTRATION ================= */

    registrationLink: {
      type: String,
      required: true,
    },

    maxParticipants: {
      type: Number,
    },

    isPublished: {
      type: Boolean,
      default: false, // admin control
    },

    /* ================= SEO ================= */

    metaTitle: { type: String },
    metaDescription: { type: String },

    prizeMoney: { type: String }, // e.g., "₹50,000" or "Win MacBook"

    faqs: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ],

    /* ================= MCQ QUESTIONS ================= */

    questions: [QuestionSchema],
  },
  { timestamps: true }
);

const AddEvent = mongoose.model("AddEvent", AddEventSchema);

module.exports = AddEvent;