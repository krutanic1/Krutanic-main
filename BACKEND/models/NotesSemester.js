const mongoose = require("mongoose");

const NotesSemesterSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotesBoard",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      // e.g. "1st Semester", "2nd Semester"
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotesSemester", NotesSemesterSchema);
