const mongoose = require("mongoose");

const MedVerticalSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true
    },
    managerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "MedTeam", 
      required: true 
    },
    targetValue: { 
      type: Number, 
      required: true 
    },
    domains: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "MedCourse", 
        required: true 
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("MedVertical", MedVerticalSchema);
