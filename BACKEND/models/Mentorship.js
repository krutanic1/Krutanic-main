const mongoose = require("mongoose");

const MentorshipSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  collegeEmail:{
    type:String
  },
  phone: {
    type: String,
    lowercase: true,
  },
  collegeName:{
    type:String
  },
  domain:{
    type:String
  },
  passingyear:{
    type:String
  },
  action:{
    type:String,
    default:"Unseen"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reason:{
    type:String
  },
  bda:{
    type:String
  }
});

module.exports = mongoose.model("Mentorship", MentorshipSchema);
