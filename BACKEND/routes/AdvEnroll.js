const express = require("express");
const router = express.Router();
const CreateBDA = require("../models/CreateBDA");
const AdvEnroll = require("../models/AdvEnroll");
const CreateCourse = require("../models/CreateCourse");
const CreateAdvCourse = require("../models/CreateAdvCourse");
const TransactionId = require("../models/AddTransactionId");
const CreateOperation = require("../models/CreateOperation");
const mongoose = require("mongoose");
const verifyAnyAuth = require("../middleware/verifyAnyAuth");

router.post("/advenroll", async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      counselor,
      lead,
      domain,
      program,
      programPrice,
      paidAmount,
      monthOpted,
      clearPaymentMonth,
      operationName,
      operationId,
      transactionId,
      alternativeEmail,
      modeofpayment,
      whatsAppNumber,
      remainingAmount,
      experience,
      paymentPlan,
      aadharNumber,
      referFriend,
      internshipstartsmonth,
      internshipendsmonth,
      yearOfPassingOut,
      companyName,
      role,
      languages,
      batchTiming
    } = req.body;

    console.log(`[AdvEnroll] POST /advenroll - Looking up domain: "${domain}"`);

    // Resilient domain lookup
    let course = await CreateAdvCourse.findOne({
      title: { $regex: new RegExp(`^${domain.trim()}$`, "i") }
    });

    if (!course) {
      // Create a flexible regex: "MERN Stack Development Advance Program" -> "MERN.*Stack.*Development.*Advanc.*Program"
      const flexiblePattern = domain.trim()
        .split(/\s+/)
        .map(word => word.replace(/Advanc(e|ed)?/i, "Advanc.*"))
        .join(".*");

      course = await CreateAdvCourse.findOne({
        title: { $regex: new RegExp(flexiblePattern, "i") }
      });
    }

    if (course) {
      console.log(`[AdvEnroll] Found domain: ${course.title} (${course._id})`);
    } else {
      console.warn(`[AdvEnroll] Domain NOT found: "${domain}"`);
    }

    const existingUser = await AdvEnroll.findOne({
      email: req.body.email,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "You have already submitted your details." });
    }

    // Lookup executive assignment from AddTransactionId table
    const transactionRecord = await TransactionId.findOne({ transactionId: email });
    let executiveId = null;
    let executive = null;

    console.log('=== ADVANCE ENROLL - EXECUTIVE ASSIGNMENT DEBUG ===');
    console.log('Looking up transaction for email:', email);
    console.log('Transaction record found:', transactionRecord);

    if (transactionRecord) {
      executiveId = transactionRecord.executiveId;
      executive = transactionRecord.executive;
      console.log('Executive ID:', executiveId);
      console.log('Executive Name:', executive);
    } else {
      console.log('NO TRANSACTION RECORD FOUND FOR EMAIL:', email);
    }

    // --- Auto-Assignment Logic for Operation Executive ---
    let assignedOperationId = operationId;
    let assignedOperationName = operationName;

    const currentHour = new Date().getHours();
    // Execute only between 10 PM (22) and 11:59 PM (23)
    if (!assignedOperationId && currentHour >= 22 && currentHour <= 23) {
      try {
        // 1. Fetch all active Operation Executives (Online only)
        const allOps = await CreateOperation.find({ isOnline: { $ne: false } });

        if (allOps.length > 0) {
          // 2. Get today's counts for each executive
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);

          const counts = await AdvEnroll.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            { $group: { _id: "$operationId", count: { $sum: 1 } } }
          ]);

          const countMap = {};
          counts.forEach(c => {
            if (c._id) countMap[c._id.toString()] = c.count;
          });

          // Helper to get count (default 0)
          const getCount = (opId) => countMap[opId.toString()] || 0;

          // 3. Filter for capacity (< 15)
          const MAX_DAILY_CAPACITY = 15;

          // Enhance ops with current count
          const opsWithCount = allOps.map(op => ({
            doc: op,
            count: getCount(op._id),
            hasLanguage: (languages && Array.isArray(languages) && op.languages && Array.isArray(op.languages))
              ? languages.some(l => op.languages.includes(l))
              : false
          }));

          // Strategy A: Find Language Match AND Under Capacity
          let candidates = opsWithCount.filter(item => item.hasLanguage && item.count < MAX_DAILY_CAPACITY);

          if (candidates.length > 0) {
            // Sort by count ascending (load balancing)
            candidates.sort((a, b) => a.count - b.count);
            assignedOperationId = candidates[0].doc._id;
            assignedOperationName = candidates[0].doc.fullname;
            console.log(`[AdvEnroll] Assigned to Language Match (Count: ${candidates[0].count}): ${assignedOperationName}`);
          } else {
            // Strategy B: Fallback - Any Under Capacity (Least Loaded)
            candidates = opsWithCount.filter(item => item.count < MAX_DAILY_CAPACITY);

            if (candidates.length > 0) {
              candidates.sort((a, b) => a.count - b.count);
              assignedOperationId = candidates[0].doc._id;
              assignedOperationName = candidates[0].doc.fullname;
              console.log(`[AdvEnroll] Assigned to Fallback Capacity (Count: ${candidates[0].count}): ${assignedOperationName}`);
            } else {
              // Strategy C: Absolute Fallback - Least Loaded Overall (even if full)
              opsWithCount.sort((a, b) => a.count - b.count);
              assignedOperationId = opsWithCount[0].doc._id;
              assignedOperationName = opsWithCount[0].doc.fullname;
              console.log(`[AdvEnroll] Assigned to Global Fallback (Count: ${opsWithCount[0].count}): ${assignedOperationName}`);
            }
          }
        }
      } catch (assErr) {
        console.error("[AdvEnroll] Error in auto-assignment logic:", assErr);
        // Proceed with default/null if error
      }
    } else {
      console.log('[AdvEnroll] Auto-assignment skipped (outside 10 PM - 12 AM window)');
    }
    // -----------------------------------------------------

    const newAdvStudent = new AdvEnroll({
      fullname,
      email,
      alternativeEmail,
      phone,
      counselor,
      lead,
      domain,
      program,
      programPrice,
      paidAmount,
      monthOpted,
      clearPaymentMonth,
      operationName: assignedOperationName,
      modeofpayment,
      transactionId,
      operationId: assignedOperationId,
      status: "booked",
      domainId: course ? course._id : null,
      whatsAppNumber,
      remainingAmount,
      experience,
      paymentPlan,
      aadharNumber,
      referFriend,
      internshipstartsmonth,
      internshipendsmonth,
      yearOfPassingOut,
      executiveId: executiveId,
      executive: executive,
      languages,
      companyName,
      role,
      batchTiming
    });

    console.log('[AdvEnroll] Creating new advance student with executiveId:', newAdvStudent.executiveId);
    console.log('[AdvEnroll] Creating new advance student with executive:', newAdvStudent.executive);

    await newAdvStudent.save();
    console.log('[AdvEnroll] Advance student saved successfully');
    res.status(201).json({ message: "Advance Program Registration successful!" });

  } catch (error) {
    console.error('[AdvEnroll] Error:', error);

    // Handle MongoDB Duplicate Key Error (Code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      let message = "This record already exists.";
      if (field === 'email') message = "You have already submitted your details with this email.";
      if (field === 'transactionId') message = "This Transaction ID has already been used. Please check and try again.";

      return res.status(400).json({ message });
    }

    res.status(500).json({
      message: "Server error while processing enrollment.",
      error: error.message
    });
  }
});

// Get all advance enrollments
router.get("/getadvenrolls", verifyAnyAuth, async (req, res) => {
  try {
    const { limit = 0, skip = 0, all } = req.query;

    // If 'all' is true, return everything without pagination
    if (all === "true") {
      const advEnrolls = await AdvEnroll.find()
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json(advEnrolls);
    }

    const advEnrolls = await AdvEnroll.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean();

    const total = await AdvEnroll.countDocuments();

    res.status(200).json({
      data: advEnrolls,
      total,
      success: true
    });
  } catch (error) {
    console.error('[AdvEnroll] Get error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get single advance enrollment by ID
router.get("/getadvenroll/:id", verifyAnyAuth, async (req, res) => {
  try {
    const advEnroll = await AdvEnroll.findById(req.params.id);
    if (!advEnroll) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(advEnroll);
  } catch (error) {
    console.error('[AdvEnroll] Get by ID error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update advance enrollment status
router.post("/updateadvenrollstatus", verifyAnyAuth, async (req, res) => {
  try {
    const { id, status } = req.body;

    const updatedEnroll = await AdvEnroll.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedEnroll) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      data: updatedEnroll
    });
  } catch (error) {
    console.error('[AdvEnroll] Update status error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update advance enrollment operation assignment
router.post("/update-adv-operation/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { operationName, operationId } = req.body;
    const { id } = req.params;

    const updatedItem = await AdvEnroll.findByIdAndUpdate(
      id,
      {
        operationName: operationName,
        operationId: operationId,
      },
      { new: true }
    );

    if (updatedItem) {
      res.status(200).json({
        message: "ADV Operation updated successfully",
        data: updatedItem
      });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error updating ADV operation:", error);
    res.status(500).json({
      message: "Error updating ADV operation",
      error: error.message
    });
  }
});

// Handle PUT request to update advance student details
router.put("/editadvstudentdetails/:_id", verifyAnyAuth, async (req, res) => {
  const { _id } = req.params;
  console.log(`[AdvEnroll] Attempting to update student ${_id} with data:`, req.body);
  const {
    fullname,
    email,
    alternativeEmail,
    phone,
    program,
    counselor,
    domain,
    programPrice,
    paidAmount,
    monthOpted,
    clearPaymentMonth,
    operationName,
    operationId,
    whatsAppNumber,
    remainingAmount,
    experience,
    paymentPlan,
    aadharNumber,
    referFriend,
    lead,
    languages,
    modeofpayment,
    transactionId,
    companyName,
    role,
    internshipstartsmonth,
    internshipendsmonth,
    yearOfPassingOut,
    batchTiming
  } = req.body;
  try {
    // Check if domain has changed
    let domainId = null;
    if (domain) {
      console.log(`[AdvEnroll] PUT /editadvstudentdetails - Looking up domain: "${domain}"`);

      // Resilient domain lookup for Edit
      let foundDomain = await CreateAdvCourse.findOne({
        title: { $regex: new RegExp(`^${domain.trim()}$`, "i") }
      });

      if (!foundDomain) {
        // Create a flexible regex for fuzzy matching
        const flexiblePattern = domain.trim()
          .split(/\s+/)
          .map(word => word.replace(/Advanc(e|ed)?/i, "Advanc.*"))
          .join(".*");

        foundDomain = await CreateAdvCourse.findOne({
          title: { $regex: new RegExp(flexiblePattern, "i") }
        });
      }

      if (foundDomain) {
        domainId = foundDomain._id;
        console.log(`[AdvEnroll] Found domain during edit: ${foundDomain.title} (${foundDomain._id})`);
      } else {
        console.error(`[AdvEnroll] Domain NOT found during edit: "${domain}"`);
        // Log all available courses to help debug
        const allCourses = await CreateAdvCourse.find({}, 'title');
        console.log('[AdvEnroll] Available courses in DB:', allCourses.map(c => `"${c.title}"`).join(', '));

        return res.status(404).json({
          message: `Domain not found: "${domain}". Please ensure it exists in Advanced Courses.`,
          availableDomains: allCourses.map(c => c.title)
        });
      }
    }

    // Update the student details including domainId
    const studentData = await AdvEnroll.findByIdAndUpdate(
      _id,
      {
        fullname,
        email,
        alternativeEmail,
        phone,
        counselor,
        domain,
        domainId,
        programPrice,
        paidAmount,
        monthOpted,
        clearPaymentMonth,
        operationName,
        operationId,
        whatsAppNumber,
        remainingAmount,
        experience,
        paymentPlan,
        aadharNumber,
        referFriend,
        lead,
        languages,
        modeofpayment,
        transactionId,
        companyName,
        role,
        internshipstartsmonth,
        internshipendsmonth,
        yearOfPassingOut,
        batchTiming
      },
      { new: true }
    );

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(studentData);
  } catch (error) {
    console.error("[AdvEnroll] Update error:", error);
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all enroll data for advance course
router.get("/advenrollments", async (req, res) => {
  const { userEmail } = req.query;
  try {
    // Fetch all advance enrollments
    const enrollments = await AdvEnroll.find({
      email: userEmail,
    }).lean();

    // Iterate over enrollments and replace domainId with course data
    const updatedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        if (enrollment.domainId) {
          const course = await CreateAdvCourse.findById(
            enrollment.domainId
          ).lean();

          // Optimization: Calculate Progress on Backend to avoid heavy payload
          let totalSessionsCount = 0;
          let watchedSessionsCount = 0;
          let progressPct = 0;

          if (course && course.session && typeof course.session === 'object') {
            totalSessionsCount = Object.keys(course.session).length;

            if (enrollment.watchedSessions && Array.isArray(enrollment.watchedSessions)) {
              const combined = new Set(enrollment.watchedSessions);
              watchedSessionsCount = Object.keys(course.session).filter(k => combined.has(k)).length;
            }
            if (totalSessionsCount > 0) {
              progressPct = Math.round((watchedSessionsCount / totalSessionsCount) * 100);
            }

            // Exclude session data from this general fetch
            delete course.session;
            delete course.sessions;
            delete course.modules;
          }

          enrollment.domain = course || null; // Replace domainId with course data
          enrollment.progressStats = {
            totalSessionsCount,
            watchedSessionsCount,
            progressPct
          };
        }
        return enrollment;
      })
    );
    res.status(200).json(updatedEnrollments);
  } catch (error) {
    console.error("[AdvEnroll] enrollments error:", error);
    res.status(500).json({ message: "Failed to fetch advance enrollments", error });
  }
});

// GET request to just load the massive session mapping for a specific advance enrollment
router.get("/advenrollments/:id/sessions", async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await AdvEnroll.findById(id).lean();
    if (!enrollment || !enrollment.domainId) {
      return res.status(404).json({ message: "Enrollment or domain not found" });
    }
    const course = await CreateAdvCourse.findById(enrollment.domainId).lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ session: course.session || {} });
  } catch (error) {
    console.error("[AdvEnroll] sessions error:", error);
    res.status(500).json({ message: "Failed to fetch advance sessions", error });
  }
});
router.get("/advgetdailyrevenue", async (req, res) => {
  const { month, year, startDate, endDate } = req.query;

  try {
    let matchStage = {};

    if (startDate && endDate) {
      // Custom Range
      // Ensure endDate covers the full day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: end
      };
    } else if (month && year) {
      // Monthly Range
      const monthMap = {
        "january": 0, "february": 1, "march": 2, "april": 3, "may": 4, "june": 5,
        "july": 6, "august": 7, "september": 8, "october": 9, "november": 10, "december": 11
      };
      const cleanMonth = (month || "").trim().toLowerCase();
      const monthIndex = monthMap[cleanMonth];

      if (monthIndex !== undefined) {
        const y = parseInt(year);
        const start = new Date(y, monthIndex, 1);
        const end = new Date(y, monthIndex + 1, 0, 23, 59, 59, 999);
        matchStage.createdAt = {
          $gte: start,
          $lte: end
        };
      } else {
        return res.status(400).json({ message: "Invalid month name" });
      }
    } else {
      // Default to current month if no params provided
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      matchStage.createdAt = { $gte: start, $lte: end };
    }

    const pipeline = [
      { $match: matchStage },
      {
        $project: {
          createdAt: 1,
          programPrice: { $ifNull: ["$programPrice", 0] },
          paidAmount: { $ifNull: ["$paidAmount", 0] },
          status: 1,
          remark: 1
        }
      },
      {
        $addFields: {
          isCredited: {
            $or: [
              { $eq: ["$status", "fullPaid"] },
              {
                $and: [
                  { $isArray: "$remark" },
                  { $gt: [{ $size: "$remark" }, 0] },
                  { $eq: [{ $arrayElemAt: ["$remark", -1] }, "Half_Cleared"] }
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          creditedAmount: {
            $cond: { if: "$isCredited", then: "$paidAmount", else: 0 }
          }
        }
      },
      {
        $addFields: {
          pendingAmount: { $subtract: ["$programPrice", "$creditedAmount"] }
        }
      },
      {
        $group: {
          // Group by date in IST timezone (+05:30)
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+05:30" } },
          displayDate: { $first: { $dateToString: { format: "%d/%m/%Y", date: "$createdAt", timezone: "+05:30" } } },
          totalRevenue: { $sum: "$programPrice" },
          bookedRevenue: { $sum: "$paidAmount" },
          creditedRevenue: { $sum: "$creditedAmount" },
          pendingRevenue: { $sum: "$pendingAmount" },
          payments: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }, // Sort by YYYY-MM-DD descending
      {
        $project: {
          _id: 0,
          date: "$displayDate",
          total: "$totalRevenue",
          booked: "$bookedRevenue",
          credited: "$creditedRevenue",
          pending: "$pendingRevenue",
          payments: "$payments"
        }
      }
    ];

    const dailyStats = await AdvEnroll.aggregate(pipeline);
    res.status(200).json(dailyStats);

  } catch (error) {
    console.error("Error in /advgetdailyrevenue:", error);
    res.status(500).json({ message: "Server error fetching daily revenue", error: error.message });
  }
});

router.get("/advgetmonthlyrevenue", verifyAnyAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1. Aggregation Pipeline for Monthly Stats
    const pipeline = [
      {
        $project: {
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          createdAt: 1,
          programPrice: { $ifNull: ["$programPrice", 0] },
          paidAmount: { $ifNull: ["$paidAmount", 0] },
          status: 1,
          remark: 1
        }
      },
      {
        $addFields: {
          // Determine if credited based on status or remark (matching frontend logic)
          isCredited: {
            $or: [
              { $eq: ["$status", "fullPaid"] },
              {
                $and: [
                  { $isArray: "$remark" },
                  { $gt: [{ $size: "$remark" }, 0] },
                  { $eq: [{ $arrayElemAt: ["$remark", -1] }, "Half_Cleared"] }
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          creditedAmount: {
            $cond: { if: "$isCredited", then: "$paidAmount", else: 0 }
          }
        }
      },
      {
        $addFields: {
          pendingAmount: { $subtract: ["$programPrice", "$creditedAmount"] }
        }
      },
      {
        $group: {
          _id: {
            month: "$month",
            year: "$year"
          },
          totalRevenue: { $sum: "$programPrice" },
          bookedRevenue: { $sum: "$paidAmount" },
          creditedRevenue: { $sum: "$creditedAmount" },
          pendingRevenue: { $sum: "$pendingAmount" },
          totalPayments: { $sum: 1 },
          firstDate: { $min: "$createdAt" } // Used for sorting
        }
      },
      {
        $sort: { firstDate: -1 } // Sort by most recent month first
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $switch: {
                  branches: [
                    { case: { $eq: ["$_id.month", 1] }, then: "January" },
                    { case: { $eq: ["$_id.month", 2] }, then: "February" },
                    { case: { $eq: ["$_id.month", 3] }, then: "March" },
                    { case: { $eq: ["$_id.month", 4] }, then: "April" },
                    { case: { $eq: ["$_id.month", 5] }, then: "May" },
                    { case: { $eq: ["$_id.month", 6] }, then: "June" },
                    { case: { $eq: ["$_id.month", 7] }, then: "July" },
                    { case: { $eq: ["$_id.month", 8] }, then: "August" },
                    { case: { $eq: ["$_id.month", 9] }, then: "September" },
                    { case: { $eq: ["$_id.month", 10] }, then: "October" },
                    { case: { $eq: ["$_id.month", 11] }, then: "November" },
                    { case: { $eq: ["$_id.month", 12] }, then: "December" }
                  ],
                  default: "Unknown"
                }
              },
              " ",
              { $toString: "$_id.year" }
            ]
          },
          total: "$totalRevenue",
          booked: "$bookedRevenue",
          credited: "$creditedRevenue",
          pending: "$pendingRevenue",
          payments: "$totalPayments"
        }
      }
    ];

    // execute aggregation
    const allMonthlyStats = await AdvEnroll.aggregate(pipeline);

    // 2. Pagination Logic (in memory since aggregation result needs slicing)
    // Note: optimization for huge datasets would require $facet in aggregation, 
    // but for monthly stats, the array size is small (number of months in operation).
    const totalItems = allMonthlyStats.length;
    const totalPages = Math.ceil(totalItems / limit);
    const paginatedData = allMonthlyStats.slice(skip, skip + limit);

    // 3. Calculate Grand Total Revenue (All Time)
    // We can sum up the results from the aggregation directly
    const grandTotal = allMonthlyStats.reduce((acc, curr) => acc + (curr.total || 0), 0);

    res.status(200).json({
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalItems,
        grandTotal: grandTotal
      }
    });

  } catch (error) {
    console.error("Error in /advgetmonthlyrevenue:", error);
    res.status(500).json({ message: "Server error fetching monthly revenue", error: error.message });
  }
});

module.exports = router;
