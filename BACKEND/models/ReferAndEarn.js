const mongoose = require("mongoose");

const ReferAndEarnSchema = new mongoose.Schema({
    name:{type:String, required:true},
    phone:{type:Number, required:true},
    friendName:{type:String, required:true},
    friendPhone:{type:Number, required:true},
    friendCollege:{type:String, required:true},
    course:{type:String, required:true},
    status:{type:String, default:"Pending"},
}, {
    timestamps:true
});

module.exports = mongoose.model("ReferAndEarn", ReferAndEarnSchema);