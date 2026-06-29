const express = require("express");
const router = express.Router();
const AdvTaskController = require("../controllers/AdvTaskController");
const verifyAnyAuth = require("../middleware/verifyAnyAuth");

// Protected Routes
router.use(verifyAnyAuth);

// Dashboard routes (must be defined before /:id routes to avoid clash)
router.get("/dashboard/counsellor", AdvTaskController.getCounsellorDashboard);
router.get("/dashboard/manager", AdvTaskController.getManagerDashboard);

// CRUD
router.post("/", AdvTaskController.createTask);
router.get("/", AdvTaskController.getTasks);
router.put("/:id", AdvTaskController.updateTask);
router.put("/:id/reassign", AdvTaskController.reassignTask);

module.exports = router;
