/**
 * Seed script — pre-populate VTU board with 8 semesters
 * Run: node BACKEND/scripts/seedNotesVTU.js
 */
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const NotesBoard = require("../models/NotesBoard");
const NotesSemester = require("../models/NotesSemester");

const MONGO_URI = process.env.DB_NAME;

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ── Create VTU board (idempotent) ──────────────────────────────────────────
  let vtu = await NotesBoard.findOne({ shortName: "VTU" });
  if (!vtu) {
    vtu = await NotesBoard.create({
      name: "Visvesvaraya Technological University",
      shortName: "VTU",
      description:
        "One of the largest technical universities in India, based in Belagavi, Karnataka. Affiliated to 200+ engineering colleges.",
      displayOrder: 1,
      isActive: true,
    });
    console.log("✅ VTU board created:", vtu._id);
  } else {
    console.log("ℹ️  VTU board already exists:", vtu._id);
  }

  // ── Create 8 semesters ─────────────────────────────────────────────────────
  const semesterNames = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ];

  for (let i = 0; i < semesterNames.length; i++) {
    const existing = await NotesSemester.findOne({
      board: vtu._id,
      name: semesterNames[i],
    });
    if (!existing) {
      await NotesSemester.create({
        board: vtu._id,
        name: semesterNames[i],
        displayOrder: i + 1,
        isActive: true,
      });
      console.log(`✅ Created: ${semesterNames[i]}`);
    } else {
      console.log(`ℹ️  Already exists: ${semesterNames[i]}`);
    }
  }

  console.log("\n🎉 VTU seed complete!");
  mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
