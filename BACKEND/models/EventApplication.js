const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventApplicationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventRegistration",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AddEvent", 
      required: true,
    },
    coin:{
      type:Number,
      default:null
    },
    remarks:{
      type:String,
    },
  },
  {
    timestamps: true,
  },

);

const EventApplication = mongoose.model("EventApplication", EventApplicationSchema);
module.exports = EventApplication;
