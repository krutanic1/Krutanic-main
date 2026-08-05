const mongoose = require("mongoose");

const VerticalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BDA", // Mentorship Managers are stored in BDA model
      required: true
    },
    targetValue: {
      type: Number,
      required: true,
      min: 0
    },
    domains: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "CreateCourse", 
        required: true 
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vertical", VerticalSchema);
