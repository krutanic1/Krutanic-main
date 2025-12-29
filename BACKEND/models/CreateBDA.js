const mongoose = require("mongoose");

const CreateBDA = new mongoose.Schema({
    fullname: { type: String, unique: true , },
    email: { type: String, unique: true , },
    password: { type: String },
    team: { type: String},
    teams: [{ type: String }], // Array of team names for managers managing multiple teams
    designation: { type: String},
    otp: { type: String },
    mailSended : {type: Boolean , default: false},
    Access:{type:Boolean , default : true},
    status: { type: String , default: "Active"},
    target:[{ currentMonth: { type: String }, targetValue: { type: String }, payments: { type: String }, }],
  });
  
  const BDA = mongoose.model("BDA", CreateBDA);
  module.exports = BDA;