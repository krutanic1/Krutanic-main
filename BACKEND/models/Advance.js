const mongoose = require("mongoose");

const AdvanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    currentRole: {
      type: String,
      required: [true, "Current role is required"],
      enum: {
        values: ["Founder", "Student", "Working Professional", "Self Employed"],
        message: "Invalid role: {VALUE}",
      },
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
      enum: {
        values: ["Fresher", "0 year", "1-2 years", "3-5 years", "5+ years"],
        message: "Invalid experience: {VALUE}",
      },
    },
    // interestedDomain accepts both short names (from old data) and full program names (from new forms)
    interestedDomain: {
      type: String,
      default: "",
    },
    goal: {
      type: String,
      required: [true, "Goal is required"],
      enum: {
        values: ["Career Transition", "Kickstart Career", "Upskilling", "Other"],
        message: "Invalid goal: {VALUE}",
      },
    },
    goalOther: {
      type: String,
      default: "",
    },
    // domain (user's current industry) — optional, popup form doesn't collect this
    domain: {
      type: String,
      default: "",
    },
    domainOther: {
      type: String,
      default: "",
    },
    passedOutYear: {
      type: String,
      default: "",
    },
    // reason — optional, popup form doesn't collect this
    reason: {
      type: String,
      default: "",
    },
    action: {
      type: String,
      default: "Unseen",
    },
  },
  {
    timestamps: true, // auto-manages createdAt & updatedAt
  }
);

module.exports = mongoose.model("Advance", AdvanceSchema);
