const mongoose = require("mongoose");
const { options } = require("../routes/AddEvent");

const EventRegistrationSchema = new mongoose.Schema({
    name: { type: String },
    phone: { type: String },
    email: { type: String },
    collegeName: { type: String},
    collegeEmailId: { type: String},
    yearofstudy: { type: String},
    otp: {type: String},
    otpExpires: {type: Date},
    profilePhoto:{type:String},
});

const EventRegistration = mongoose.model("EventRegistration", EventRegistrationSchema);

module.exports = EventRegistration;