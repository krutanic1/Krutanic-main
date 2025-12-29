const mongoose = require("mongoose");

const CreateMarketing = new mongoose.Schema({
    fullname: { type: String, unique: true , },
    email: { type: String, unique: true , lowercase: true },
    password: { type: String, default : "KrutanicM@123" },
    team: { type: String},
    designation: { type: String},
    otp: { type: String },
    mailSended : {type: Boolean , default: false},
    Access:{type:Boolean , default : true},
    status: { type: String , default: "Active"},
  });
  
  const MarketingTeam = mongoose.model("MarketingTeam", CreateMarketing);
  module.exports = MarketingTeam;