const express = require("express");
const router = express.Router();
const { createVertical, getVerticals, getVerticalsByManager, updateVertical, deleteVertical, getVerticalEnrollments } = require("../controllers/verticalController");

// Define routes
router.post("/create", createVertical);
router.get("/", getVerticals);
router.get("/manager/:managerId", getVerticalsByManager);
router.get("/:verticalId/enrollments", getVerticalEnrollments);
router.put("/:id", updateVertical);
router.delete("/:id", deleteVertical);

module.exports = router;
