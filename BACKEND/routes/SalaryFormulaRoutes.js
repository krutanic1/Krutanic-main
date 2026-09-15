const express = require("express");
const router = express.Router();
const SalaryFormula = require("../models/SalaryFormula");
const BDA = require("../models/CreateBDA");
const NewEnroll = require("../models/NewStudentEnroll");
const verifyAnyAuth = require("../middleware/verifyAnyAuth");

// Admin: Get ONLY active BDAs for assigning formulas
router.get("/active-bdas", verifyAnyAuth, async (req, res) => {
  try {
    const activeBdas = await BDA.find({ 
      status: "Active"
    }).select("fullname email _id").sort({ fullname: 1 });
    res.status(200).json(activeBdas);
  } catch (error) {
    console.error("Error fetching active BDAs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Create a new salary formula
router.post("/salary-formula", verifyAnyAuth, async (req, res) => {
  try {
    const { name, target, basePay, incentives, minPercent } = req.body;
    
    // Check if formula with same name exists
    const existing = await SalaryFormula.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Formula with this name already exists" });
    }

    const newFormula = new SalaryFormula({
      name,
      target,
      basePay,
      incentives,
      minPercent,
    });
    
    await newFormula.save();
    res.status(201).json(newFormula);
  } catch (error) {
    console.error("Error creating formula:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Get all salary formulas
router.get("/salary-formula", verifyAnyAuth, async (req, res) => {
  try {
    const formulas = await SalaryFormula.find().populate("assignedBDAs", "fullname email");
    res.status(200).json(formulas);
  } catch (error) {
    console.error("Error fetching formulas:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Assign a formula to specific BDAs
router.put("/salary-formula/:id/assign", verifyAnyAuth, async (req, res) => {
  try {
    const { bdaIds } = req.body; // Array of BDA ObjectIds
    const formulaId = req.params.id;

    // Remove these BDAs from any other formula first (a BDA can only have one active formula)
    await SalaryFormula.updateMany(
      {},
      { $pull: { assignedBDAs: { $in: bdaIds } } }
    );

    // Assign them to the new formula
    const updatedFormula = await SalaryFormula.findByIdAndUpdate(
      formulaId,
      { $addToSet: { assignedBDAs: { $each: bdaIds } } },
      { new: true }
    ).populate("assignedBDAs", "fullname email");

    res.status(200).json(updatedFormula);
  } catch (error) {
    console.error("Error assigning formula:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Delete a formula
router.delete("/salary-formula/:id", verifyAnyAuth, async (req, res) => {
  try {
    await SalaryFormula.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Formula deleted successfully" });
  } catch (error) {
    console.error("Error deleting formula:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// BDA: Get assigned salary formula and calculate current credited revenue
router.get("/bda/:fullname/salary-formula", verifyAnyAuth, async (req, res) => {
  try {
    const { fullname } = req.params;
    
    // Find the BDA by name to get their ID
    const bda = await BDA.findOne({ fullname: fullname });
    if (!bda) {
      return res.status(404).json({ message: "BDA not found" });
    }

    // Find the formula assigned to this BDA
    const formula = await SalaryFormula.findOne({ assignedBDAs: bda._id });
    if (!formula) {
      return res.status(404).json({ message: "No salary formula assigned to this BDA" });
    }

    // Calculate Credited Revenue based on user's exact specification:
    // We get the start and end dates based on the requested month (or current month if not provided)
    const { month } = req.query; // Expecting format "YYYY-MM"
    let targetDate = new Date();
    if (month) {
      const [year, monthIndex] = month.split('-');
      targetDate = new Date(year, monthIndex - 1, 1);
    }
    
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const enrollments = await NewEnroll.find({
      counselor: { $regex: new RegExp(`^${fullname}$`, 'i') },
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    let creditedRevenue = 0;
    
    enrollments.forEach(enroll => {
      const price = Number(enroll.programPrice) || 0;
      const paid = Number(enroll.paidAmount) || 0;
      const diff = price - paid;
      
      // Check if it's considered fully paid based on the rule
      if (enroll.status && enroll.status.toLowerCase() === 'fullpaid' || diff <= 0) {
        creditedRevenue += price;
      }
    });

    res.status(200).json({
      formula: formula,
      creditedRevenue: creditedRevenue
    });
  } catch (error) {
    console.error("Error fetching BDA salary data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin: Get all BDAs' salary overview
router.get("/admin/bda-salaries-overview", verifyAnyAuth, async (req, res) => {
  try {
    const { month } = req.query; // Expecting format "YYYY-MM"
    let targetDate = new Date();
    if (month) {
      const [year, monthIndex] = month.split('-');
      targetDate = new Date(year, monthIndex - 1, 1);
    }
    
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const formulas = await SalaryFormula.find();
    let bdaSalaries = [];

    // Optimize by fetching all enrollments for the month in one go
    const allEnrollments = await NewEnroll.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth }
    });

    for (let formula of formulas) {
      if (!formula.assignedBDAs || formula.assignedBDAs.length === 0) continue;
      
      const bdas = await BDA.find({ _id: { $in: formula.assignedBDAs } });
      
      for (let bda of bdas) {
        // Filter enrollments for this specific BDA (case-insensitive)
        const bdaEnrollments = allEnrollments.filter(e => 
          e.counselor && e.counselor.toLowerCase() === bda.fullname.toLowerCase()
        );
        
        let creditedRevenue = 0;
        bdaEnrollments.forEach(enroll => {
          const price = Number(enroll.programPrice) || 0;
          const paid = Number(enroll.paidAmount) || 0;
          const diff = price - paid;
          if (enroll.status && enroll.status.toLowerCase() === 'fullpaid' || diff <= 0) {
            creditedRevenue += price;
          }
        });

        // Compute salary stats
        const T = formula.target;
        const B = formula.basePay;
        const I = formula.incentives;
        const minPct = formula.minPercent;
        const R = creditedRevenue;

        const achievedPct = T > 0 ? (R / T) * 100 : 0;
        
        let earnedBasePay = 0;
        let earnedIncentives = 0;

        if (achievedPct < minPct) {
          earnedBasePay = T > 0 ? (R / T) * B : 0;
          earnedIncentives = 0;
        } else {
          earnedBasePay = B;
          const incentiveRange = 100 - minPct;
          const achievedAboveMin = Math.min(achievedPct, 100) - minPct;
          const incentivePct = incentiveRange > 0 ? achievedAboveMin / incentiveRange : 1;
          earnedIncentives = Math.min(incentivePct, 1) * I;
        }

        bdaSalaries.push({
          bdaId: bda._id,
          bdaName: bda.fullname,
          bdaEmail: bda.email,
          formulaName: formula.name,
          target: T,
          revenue: R,
          achievedPct: achievedPct.toFixed(2),
          basePay: earnedBasePay,
          incentives: earnedIncentives,
          totalSalary: earnedBasePay + earnedIncentives
        });
      }
    }
    
    // Sort by total salary descending
    bdaSalaries.sort((a, b) => b.totalSalary - a.totalSalary);

    res.status(200).json(bdaSalaries);
  } catch (error) {
    console.error("Error fetching admin BDA salaries overview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
