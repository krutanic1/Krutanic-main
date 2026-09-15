const mongoose = require("mongoose");

const salaryFormulaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    target: {
      type: Number,
      required: true,
    },
    basePay: {
      type: Number,
      required: true,
    },
    incentives: {
      type: Number,
      required: true,
    },
    minPercent: {
      type: Number,
      required: true,
    },
    assignedBDAs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BDA",
      },
    ],
  },
  { timestamps: true }
);

const SalaryFormula = mongoose.model("SalaryFormula", salaryFormulaSchema);
module.exports = SalaryFormula;
