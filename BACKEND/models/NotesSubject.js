const mongoose = require("mongoose");

const NotesSubjectSchema = new mongoose.Schema(
  {
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NotesSemester",
      required: true,
    },
    // Schema/Year — e.g. "2022", "2023", "2021"
    schemaYear: {
      type: String,
      required: true,
      trim: true,
    },
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // Google Drive or any PDF link
    pdfDriveLink: {
      type: String,
      required: true,
      trim: true,
    },
    // Optional thumbnail / cover image
    thumbnailUrl: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for fast drill-down queries
NotesSubjectSchema.index({ semester: 1, schemaYear: 1 });

module.exports = mongoose.model("NotesSubject", NotesSubjectSchema);
