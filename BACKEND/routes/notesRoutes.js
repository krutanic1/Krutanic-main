const express = require("express");
const router = express.Router();
const NotesBoard = require("../models/NotesBoard");
const NotesSemester = require("../models/NotesSemester");
const NotesSubject = require("../models/NotesSubject");

// ─── Simple admin auth middleware ─────────────────────────────────────────────
const adminAuth = (req, res, next) => {
  const token = req.headers["x-admin-token"] || req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: admin token required" });
  }
  // Reuse the same JWT verification used by other admin routes
  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET || "secret"
    );
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES  (no auth needed)
// ═══════════════════════════════════════════════════════════════════════════════

// GET /api/notes/boards — all active boards
router.get("/boards", async (req, res) => {
  try {
    const boards = await NotesBoard.find({ isActive: true }).sort({
      displayOrder: 1,
      name: 1,
    });
    res.json(boards);
  } catch (err) {
    console.error("Notes boards fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/notes/semesters?boardId=xxx — semesters for a board
router.get("/semesters", async (req, res) => {
  try {
    const { boardId } = req.query;
    if (!boardId) return res.status(400).json({ message: "boardId is required" });
    const semesters = await NotesSemester.find({
      board: boardId,
      isActive: true,
    }).sort({ displayOrder: 1, name: 1 });
    res.json(semesters);
  } catch (err) {
    console.error("Notes semesters fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/notes/schemas?semesterId=xxx — distinct schema years for a semester
router.get("/schemas", async (req, res) => {
  try {
    const { semesterId } = req.query;
    if (!semesterId)
      return res.status(400).json({ message: "semesterId is required" });
    const schemas = await NotesSubject.distinct("schemaYear", {
      semester: semesterId,
      isActive: true,
    });
    // Sort descending (newest schema first)
    schemas.sort((a, b) => b.localeCompare(a));
    res.json(schemas);
  } catch (err) {
    console.error("Notes schemas fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/notes/subjects?semesterId=xxx&schema=2022 — subjects for a semester + schema
router.get("/subjects", async (req, res) => {
  try {
    const { semesterId, schema } = req.query;
    if (!semesterId || !schema)
      return res
        .status(400)
        .json({ message: "semesterId and schema are required" });
    const subjects = await NotesSubject.find({
      semester: semesterId,
      schemaYear: schema,
      isActive: true,
    }).sort({ displayOrder: 1, subjectName: 1 });
    res.json(subjects);
  } catch (err) {
    console.error("Notes subjects fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES  (admin token required)
// ═══════════════════════════════════════════════════════════════════════════════

// ── Boards ──────────────────────────────────────────────────────────────────

// GET all boards (including inactive) for admin
router.get("/admin/boards", adminAuth, async (req, res) => {
  try {
    const boards = await NotesBoard.find().sort({ displayOrder: 1, name: 1 });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create board
router.post("/admin/boards", adminAuth, async (req, res) => {
  try {
    const { name, shortName, description, logoUrl, displayOrder } = req.body;
    if (!name || !shortName)
      return res.status(400).json({ message: "name and shortName required" });
    const board = new NotesBoard({
      name,
      shortName,
      description,
      logoUrl,
      displayOrder: displayOrder || 0,
    });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Board already exists" });
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update board
router.put("/admin/boards/:id", adminAuth, async (req, res) => {
  try {
    const board = await NotesBoard.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!board) return res.status(404).json({ message: "Board not found" });
    res.json(board);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE board
router.delete("/admin/boards/:id", adminAuth, async (req, res) => {
  try {
    await NotesBoard.findByIdAndDelete(req.params.id);
    res.json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── Semesters ────────────────────────────────────────────────────────────────

// GET all semesters (admin, with board populated)
router.get("/admin/semesters", adminAuth, async (req, res) => {
  try {
    const { boardId } = req.query;
    const filter = boardId ? { board: boardId } : {};
    const semesters = await NotesSemester.find(filter)
      .populate("board", "name shortName")
      .sort({ displayOrder: 1, name: 1 });
    res.json(semesters);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create semester
router.post("/admin/semesters", adminAuth, async (req, res) => {
  try {
    const { board, name, displayOrder } = req.body;
    if (!board || !name)
      return res.status(400).json({ message: "board and name required" });
    const semester = new NotesSemester({ board, name, displayOrder: displayOrder || 0 });
    await semester.save();
    res.status(201).json(semester);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update semester
router.put("/admin/semesters/:id", adminAuth, async (req, res) => {
  try {
    const semester = await NotesSemester.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!semester) return res.status(404).json({ message: "Semester not found" });
    res.json(semester);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE semester
router.delete("/admin/semesters/:id", adminAuth, async (req, res) => {
  try {
    await NotesSemester.findByIdAndDelete(req.params.id);
    res.json({ message: "Semester deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── Subjects ─────────────────────────────────────────────────────────────────

// GET all subjects (admin)
router.get("/admin/subjects", adminAuth, async (req, res) => {
  try {
    const { semesterId, schema } = req.query;
    const filter = {};
    if (semesterId) filter.semester = semesterId;
    if (schema) filter.schemaYear = schema;
    const subjects = await NotesSubject.find(filter)
      .populate({ path: "semester", populate: { path: "board", select: "name shortName" } })
      .sort({ displayOrder: 1, subjectName: 1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create subject
router.post("/admin/subjects", adminAuth, async (req, res) => {
  try {
    const {
      semester,
      schemaYear,
      subjectName,
      subjectCode,
      description,
      pdfDriveLink,
      thumbnailUrl,
      displayOrder,
    } = req.body;
    if (!semester || !schemaYear || !subjectName || !pdfDriveLink)
      return res.status(400).json({
        message: "semester, schemaYear, subjectName and pdfDriveLink are required",
      });
    const subject = new NotesSubject({
      semester,
      schemaYear,
      subjectName,
      subjectCode,
      description,
      pdfDriveLink,
      thumbnailUrl,
      displayOrder: displayOrder || 0,
    });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update subject
router.put("/admin/subjects/:id", adminAuth, async (req, res) => {
  try {
    const subject = await NotesSubject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE subject
router.delete("/admin/subjects/:id", adminAuth, async (req, res) => {
  try {
    await NotesSubject.findByIdAndDelete(req.params.id);
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
