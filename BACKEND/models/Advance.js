const mongoose = require("mongoose");

const AdvanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  currentRole: {
    type: String,
    required: true,
    enum: ["Founder", "Student", "Working Professional", "Self Employed"],
  },
  experience: {
    type: String,
    required: true,
    enum: ["0 year", "1-2 years", "3-5 years", "5+ years"],
  },
  interestedDomain: {
    type: String,
    enum: ["Data Science", "Digital Marketing", "Investment Banking", "MERN Stack Development", "Product Management", "Performance Marketing", "Prompt Engineering in Generative AI", "Automation Testing"],
  },
  goal: {
    type: String,
    required: true,
    enum: ["Career Transition", "Kickstart Career", "Upskilling", "Other"],
  },
  goalOther: {
    type: String,
    required: function () {
      return this.goal === "Other";
    },
  },
  domain: {
    type: String,
    required: true,
    enum: ["Digital Marketing/Performance marketing", "Marketing/Sales", "Management/Operations", "IT/Tech/Product", "Other"],
  },
  domainOther: {
    type: String,
    required: function () {
      return this.domain === "Other";
    },
  },
  passedOutYear: {
    type: String,
  },
  reason: {
    type: String,
    required: true,
    enum: [
      "I Want to Know More About the Program",
      "I've Reviewed the Program – Need Career Guidance",
      "I'm Ready to Enroll",
      "I'm Already Enrolled – Need Support"
    ],
  },
  action: {
    type: String,
    default: "Unseen"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Advance", AdvanceSchema);
