const express = require("express");
const router = express.Router();
const CreateBDA = require("../models/CreateBDA");
const NewEnrollStudent = require("../models/NewStudentEnroll");
const CreateCourse = require("../models/CreateCourse");
const AdvEnroll = require("../models/AdvEnroll");
const TransactionId = require("../models/AddTransactionId");
const CreateOperation = require("../models/CreateOperation");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/UserAuth");
const verifyAnyAuth = require("../middleware/verifyAnyAuth");

router.post("/newstudentenroll", async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      program,
      counselor,
      lead,
      domain,
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
      collegeName,
      branch,
      aadharNumber,
      referFriend,
      internshipstartsmonth,
      internshipendsmonth,
      yearOfStudy,
      languages
    } = req.body;
    const course = await CreateCourse.findOne({ title: domain });

    const existingUser = await NewEnrollStudent.findOne({
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

    console.log('=== EXECUTIVE ASSIGNMENT DEBUG ===');
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

          const counts = await NewEnrollStudent.aggregate([
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
            console.log(`Assigned to Language Match (Count: ${candidates[0].count}): ${assignedOperationName}`);
          } else {
            // Strategy B: Fallback - Any Under Capacity (Least Loaded)
            candidates = opsWithCount.filter(item => item.count < MAX_DAILY_CAPACITY);

            if (candidates.length > 0) {
              candidates.sort((a, b) => a.count - b.count);
              assignedOperationId = candidates[0].doc._id;
              assignedOperationName = candidates[0].doc.fullname;
              console.log(`Assigned to Fallback Capacity (Count: ${candidates[0].count}): ${assignedOperationName}`);
            } else {
              // Strategy C: Absolute Fallback - Least Loaded Overall (even if full)
              opsWithCount.sort((a, b) => a.count - b.count);
              assignedOperationId = opsWithCount[0].doc._id;
              assignedOperationName = opsWithCount[0].doc.fullname;
              console.log(`Assigned to Global Fallback (Count: ${opsWithCount[0].count}): ${assignedOperationName}`);
            }
          }
        }
      } catch (assErr) {
        console.error("Error in auto-assignment logic:", assErr);
        // Proceed with default/null if error
      }
    } else {
      console.log('Auto-assignment skipped (outside 10 PM - 12 AM window)');
    }
    // -----------------------------------------------------

    const newStudent = new NewEnrollStudent({
      fullname,
      email,
      alternativeEmail,
      phone,
      program,
      counselor,
      lead,
      domain,
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
      collegeName,
      branch,
      aadharNumber,
      referFriend,
      internshipstartsmonth,
      internshipendsmonth,
      yearOfStudy,
      executiveId: executiveId,  // Add executive assignment from BDA
      executive: executive,       // Add executive assignment from BDA
      languages
    });

    console.log('Creating new student with executiveId:', newStudent.executiveId);
    console.log('Creating new student with executive:', newStudent.executive);

    await newStudent.save();
    console.log('Student saved successfully');
    res.status(201).json({ message: "Registration successful!" });

    // Submit to Google Sheets in background (non-blocking)
    convertExcel(newStudent).catch(err => {
      console.error('Background Google Sheets submission error:', err);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// GET: Check if a student already enrolled (for dashboard access form email lookup)
// Returns clearPaymentMonth + internship months if found (read-only display on form)
router.get("/check-existing-enrollment", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const student = await NewEnrollStudent.findOne(
      { email: email.trim().toLowerCase() },
      { clearPaymentMonth: 1, internshipstartsmonth: 1, internshipendsmonth: 1, fullname: 1 }
    ).lean();

    if (!student) {
      return res.status(200).json({ exists: false });
    }

    return res.status(200).json({
      exists: true,
      clearPaymentMonth: student.clearPaymentMonth || "",
      internshipstartsmonth: student.internshipstartsmonth || "",
      internshipendsmonth: student.internshipendsmonth || "",
    });
  } catch (error) {
    console.error("Error checking existing enrollment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Submits student enrollment data to Google Sheets via Google Apps Script
 * Features:
 * - Automatic retry with exponential backoff (up to 3 attempts)
 * - 10-second timeout per request
 * - Graceful error handling (non-critical operation)
 * - Returns true on success, false on failure
 * 
 * @param {Object} studentData - Student enrollment data
 * @param {number} retryCount - Current retry attempt (internal use)
 * @returns {Promise<boolean>} Success status
 */
const convertExcel = async (studentData, retryCount = 0) => {
  const MAX_RETRIES = 3;
  const TIMEOUT_MS = 10000; // 10 seconds timeout
  const RETRY_DELAY_MS = 1000; // 1 second base delay

  try {
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzNjOLLASJArLOojBwDoNMkYaHYBqRf-nq5_e4esAl5epYN9chf3RjAZP2eyhc5iXUi/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Connection": "keep-alive",
        },
        body: new URLSearchParams({
          // _id: studentData._id,
          createdAt: studentData.createdAt,
          fullname: studentData.fullname,
          email: studentData.email,
          alternativeEmail: studentData.alternativeEmail,
          phone: studentData.phone,
          whatsAppNumber: studentData.whatsAppNumber,
          collegeName: studentData.collegeName,
          branch: studentData.branch,
          program: studentData.program,
          counselor: studentData.counselor,
          domainId: studentData.domainId,
          domain: studentData.domain,
          programPrice: studentData.programPrice,
          paidAmount: studentData.paidAmount,
          remainingAmount: studentData.remainingAmount,
          modeofpayment: studentData.modeofpayment,
          monthOpted: studentData.monthOpted,
          clearPaymentMonth: studentData.clearPaymentMonth,
          transactionId: studentData.transactionId,
          aadharNumber: studentData.aadharNumber,
          // referFriend: studentData.referFriend,
          // operationName: studentData.operationName,
          // operationId: studentData.operationId,
          // status: studentData.status,
          // mailSended: studentData.mailSended,
          // offerLetterSended: studentData.offerLetterSended,
          // __v: studentData.__v,
          // updatedAt: studentData.updatedAt,
          // onboardingSended: studentData.onboardingSended,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log("✓ Google Sheets submission successful for:", studentData.email);
      return true;
    } else {
      const errorText = await response.text().catch(() => 'Unable to read error response');
      throw new Error(`Google Sheets API returned ${response.status}: ${errorText}`);
    }
  } catch (error) {
    // Check if this is a retryable error
    const isRetryableError =
      error.name === 'AbortError' ||
      error.code === 'ECONNRESET' ||
      error.code === 'ETIMEDOUT' ||
      error.code === 'ENOTFOUND' ||
      error.message.includes('fetch failed') ||
      error.message.includes('network');

    if (isRetryableError && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount); // Exponential backoff
      console.warn(`⚠ Google Sheets submission failed (attempt ${retryCount + 1}/${MAX_RETRIES + 1}). Retrying in ${delay}ms...`);
      console.warn(`Error details:`, error.message);

      await new Promise(resolve => setTimeout(resolve, delay));
      return convertExcel(studentData, retryCount + 1);
    } else {
      // Log error but don't throw - this is a non-critical background operation
      console.error("✗ Google Sheets submission failed after retries for:", studentData.email);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        name: error.name,
        retryCount: retryCount
      });
      return false;
    }
  }
};


/**
 * GET /getmonthlyrevenue
 * Aggregates revenue data by month including total, credited, and pending amounts.
 * Supports pagination.
 */
router.get("/getmonthlyrevenue", verifyAnyAuth, async (req, res) => {
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
    const allMonthlyStats = await NewEnrollStudent.aggregate(pipeline);

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
    console.error("Error in /getmonthlyrevenue:", error);
    res.status(500).json({ message: "Server error fetching monthly revenue", error: error.message });
  }
});

// GET request to retrieve all new student enroll
router.get("/getnewstudentenroll", verifyAnyAuth, async (req, res) => {
  const { studentenrollid, month, year, startDate, endDate, all, page, limit, status, search, counselor, operationName } = req.query;
  try {
    let StudentEnroll;
    if (studentenrollid) {
      // Fetch specific operation by userId
      StudentEnroll = await NewEnrollStudent.findById(studentenrollid).lean();
      if (!StudentEnroll) {
        return res
          .status(404)
          .json({ message: "Student Eroll not found for the given userId" });
      }
      return res.status(200).json(StudentEnroll);
    } else {
      let query = {};

      // Filter by Unassigned Operation (New Onboarding Users)
      if (req.query.unassigned === 'true') {
        query.$or = [
          { operationName: null },
          { operationName: { $exists: false } },
          { operationName: "" }
        ];
      }

      // Filter by Status
      if (status) {
        query.status = status;
      }

      // Filter by Counselor
      if (counselor) {
        query.counselor = { $regex: `^${counselor}$`, $options: "i" };
      }

      // Filter by Operation Name
      if (operationName) {
        query.operationName = operationName;
      }

      // Filter by Search Query (Case-insensitive regex)
      if (search) {
        const searchRegex = { $regex: search, $options: "i" };
        query.$or = [
          { email: searchRegex },
          { phone: searchRegex },
          { fullname: searchRegex },
          { counselor: searchRegex },
          { operationName: searchRegex },
          { collegeName: searchRegex },
          { branch: searchRegex },
          { transactionId: searchRegex }
        ];
      }

      // Filter by Remark (last element of remark array)
      if (req.query.remark) {
        query.$expr = {
          $eq: [
            { $arrayElemAt: ["$remark", -1] },
            req.query.remark
          ]
        };
      }

      // Filter by Date Range (Custom or Monthly)
      if (startDate && endDate) {
        // Custom Range
        // Ensure endDate covers the full day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        query.createdAt = {
          $gte: new Date(startDate),
          $lte: end
        };
      } else if (month && year) {
        // Monthly Range
        // Map month names to index (Case-insensitive)
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

          query.createdAt = {
            $gte: start,
            $lte: end
          };
        } else {
          console.warn("Invalid month name received:", month);
        }
      }

      // Pagination Logic
      // If 'all' is true, return everything (no pagination)
      if (all === "true") {
        StudentEnroll = await NewEnrollStudent.find(query).sort({ createdAt: -1 }).lean();
        return res.status(200).json(StudentEnroll);
      } else {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const skip = (pageNum - 1) * limitNum;

        const totalItems = await NewEnrollStudent.countDocuments(query);
        const totalPages = Math.ceil(totalItems / limitNum);

        StudentEnroll = await NewEnrollStudent.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean();

        return res.status(200).json({
          data: StudentEnroll,
          pagination: {
            totalItems,
            totalPages,
            currentPage: pageNum,
            itemsPerPage: limitNum
          }
        });
      }
    }
  } catch (error) {
    console.error("Error in /getnewstudentenroll:", error);
    res.status(500).json({
      message: "An error occurred while fetching data",
      error: error.message,
    });
  }
});

// Handle POST request to update remark for an existing student
router.post("/updateremark", verifyAnyAuth, async (req, res) => {
  const { remark, studentId, referRemark } = req.body;
  try {
    let existingStudent = await NewEnrollStudent.findById(studentId);
    if (!existingStudent) {
      existingStudent = await AdvEnroll.findById(studentId);
    }

    if (!existingStudent) {
      return res.status(404).json({ error: "Student not found." });
    }
    if (remark) {
      existingStudent.remark.push(remark);
    }

    if (referRemark) {
      existingStudent.referRemark.push(referRemark);
    }
    await existingStudent.save();
    return res.status(200).json({ message: "Remark added successfully!" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Server error. Please try again later." });
  }
});

// Handle PUT request to update student details
router.put("/editstudentdetails/:_id", verifyAnyAuth, async (req, res) => {
  const { _id } = req.params;
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
    whatAppNumber,
    remainingAmount,
    collegeName,
    branch,
    aadharNumber,
    referFriend,
    lead,
    languages
  } = req.body;
  try {
    // Check if domain has changed
    let domainId = null;
    if (domain) {
      // Fetch the domainId based on the domain name
      const foundDomain = await CreateCourse.findOne({ title: domain }); // assuming domain field is 'name'
      if (foundDomain) {
        domainId = foundDomain._id;
      } else {
        return res.status(404).json({ message: "Domain not found" });
      }
    }

    // Update the student details including domainId
    const studentData = await NewEnrollStudent.findByIdAndUpdate(
      _id,
      {
        fullname,
        email,
        alternativeEmail,
        phone,
        program,
        counselor,
        domain,
        domainId,
        programPrice,
        paidAmount,
        monthOpted,
        clearPaymentMonth,
        operationName,
        operationId,
        whatsAppNumber: whatsAppNumber ?? whatAppNumber,
        remainingAmount,
        collegeName,
        branch,
        aadharNumber,
        referFriend,
        lead,
        languages
      },
      { new: true }
    );

    if (!studentData) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(studentData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// handle post request to update the student's status and edit access
router.post("/updateStudentStatus", verifyAnyAuth, async (req, res) => {
  const { studentId, status } = req.body;
  try {
    const student = await NewEnrollStudent.findById(studentId);
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    if (status) {
      student.status = status;
    }
    await student.save();
    res.status(200).send({ message: "Student updated successfully", student });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).send({ message: "Server error" });
  }
});

//post request to update the operation name and id from admin panel
router.post("/update-operation/:id", verifyAnyAuth, async (req, res) => {
  try {
    const { operationName, operationId } = req.body;
    const { id } = req.params;
    const objectId = new mongoose.Types.ObjectId(id);
    const updatedItem = await NewEnrollStudent.findByIdAndUpdate(
      { _id: objectId },
      {
        operationName: operationName,
        operationId: operationId,
      },
      { new: true }
    );
    if (updatedItem) {
      res.status(200).json({ message: "Operation updated successfully" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating operation", error });
  }
});

// GET request to retrieve all enroll data with course
router.get("/enrollments", async (req, res) => {
  const { userEmail } = req.query;
  try {
    // Fetch all enrollments
    const enrollments = await NewEnrollStudent.find({
      email: userEmail,
    }).lean();

    // Iterate over enrollments and replace domainId with course data
    const updatedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        if (enrollment.domainId) {
          const course = await CreateCourse.findById(
            enrollment.domainId
          ).lean();

          // Optimization: Calculate Progress on Backend to avoid heavy payload
          let totalSessionsCount = 0;
          let watchedSessionsCount = 0;
          let progressPct = 0;

          if (course && course.session) {
            const sessionKeys = Object.keys(course.session);
            totalSessionsCount = sessionKeys.length;

            if (enrollment.watchedSessions && Array.isArray(enrollment.watchedSessions)) {
              const combined = new Set(enrollment.watchedSessions);
              watchedSessionsCount = sessionKeys.filter((k) => combined.has(k)).length;
            }
            if (totalSessionsCount > 0) {
              progressPct = Math.round((watchedSessionsCount / totalSessionsCount) * 100);
            }

            // Exclude massive session data from this general fetch
            delete course.session;
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
    console.error(error);
    res.status(500).json({ message: "Failed to fetch enrollments", error });
  }
});

// GET request to just load the massive session mapping for a specific enrollment
router.get("/enrollments/:id/sessions", async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await NewEnrollStudent.findById(id).lean();
    if (!enrollment || !enrollment.domainId) {
      return res.status(404).json({ message: "Enrollment or domain not found" });
    }
    const course = await CreateCourse.findById(enrollment.domainId).lean();
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ session: course.session || {} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch sessions", error: error.message });
  }
});

router.post("/updateprogress", async (req, res) => {
  const { enrollmentId, watchedSessions } = req.body;
  try {
    // Try regular enrollment first
    let student = await NewEnrollStudent.findByIdAndUpdate(
      enrollmentId,
      { watchedSessions: watchedSessions },
      { new: true }
    );

    // If not found, try advance enrollment
    if (!student) {
      student = await AdvEnroll.findByIdAndUpdate(
        enrollmentId,
        { watchedSessions: watchedSessions },
        { new: true }
      );
    }

    if (!student) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    res.status(200).json({ message: "Progress updated", watchedSessions: student.watchedSessions });
  } catch (error) {
    console.error("Error updating progress:", error);
    res.status(500).json({ message: "Failed to update progress", error });
  }
});

// Lock a project for the practical section (cannot be changed once set)
router.post("/select-project", authMiddleware, async (req, res) => {
  const { enrollmentId, projectTitle } = req.body;
  try {
    if (!enrollmentId || !projectTitle) {
      return res.status(400).json({ message: "enrollmentId and projectTitle are required" });
    }
    // Try regular, then advance enrollment
    let student = await NewEnrollStudent.findById(enrollmentId);
    if (!student) {
      student = await AdvEnroll.findById(enrollmentId);
    }
    if (!student) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    if (student.email !== req.user.email) {
      return res.status(403).json({ message: "Not authorized to modify this enrollment" });
    }
    // Prevent changing once set
    if (student.selectedProject) {
      return res.status(400).json({ message: "Project already selected. Cannot change.", selectedProject: student.selectedProject });
    }
    student.selectedProject = projectTitle;
    await student.save();
    res.status(200).json({ message: "Project locked successfully", selectedProject: student.selectedProject });
  } catch (error) {
    console.error("Error selecting project:", error);
    res.status(500).json({ message: "Failed to select project", error: error.message });
  }
});

// Update day log for the practical project roadmap
router.post("/update-project-progress", authMiddleware, async (req, res) => {
  const { enrollmentId, dayKey, dayData } = req.body;
  try {
    if (!enrollmentId || !dayKey) {
      return res.status(400).json({ message: "enrollmentId and dayKey are required" });
    }
    const update = { [`projectProgress.${dayKey}`]: dayData };

    // Try regular enrollment first, then advance
    let student = await NewEnrollStudent.findOneAndUpdate(
      { _id: enrollmentId, email: req.user.email },
      { $set: update },
      { new: true }
    );
    if (!student) {
      student = await AdvEnroll.findOneAndUpdate(
        { _id: enrollmentId, email: req.user.email },
        { $set: update },
        { new: true }
      );
    }
    if (!student) {
      return res.status(404).json({ message: "Enrollment not found or unauthorized to modify it" });
    }
    res.status(200).json({ message: "Progress updated", projectProgress: Object.fromEntries(student.projectProgress || new Map()) });
  } catch (error) {
    console.error("Error updating project progress:", error);
    res.status(500).json({ message: "Failed to update project progress", error: error.message });
  }
});

router.get("/bda-with-enrolls", async (req, res) => {
  try {
    const bdaWithEnrolls = await CreateBDA.aggregate([
      {
        $match: {
          status: { $ne: "Inactive" },
        },
      },
      {
        $lookup: {
          from: "newenrolls",
          localField: "fullname",
          foreignField: "counselor",
          as: "enrollments",
        },
      },
    ]);

    res.status(200).json(bdaWithEnrolls);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

router.get("/databyopname", async (req, res) => {
  const { operationName } = req.query;
  try {
    const OpName = await NewEnrollStudent.find({ operationName: operationName })
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json(OpName);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch enrollments", error });
  }
});

router.get("/databybdaname", async (req, res) => {
  const { bdaName } = req.query;
  try {
    const students = await NewEnrollStudent.find({ counselor: bdaName })
      .select("fullname phone referFriend createdAt referRemark")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch enrollments", error });
  }
});


// GET /getdailyrevenue
// Aggregates revenue data by day within a month or custom range.
router.get("/getdailyrevenue", async (req, res) => {
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

    const dailyStats = await NewEnrollStudent.aggregate(pipeline);
    res.status(200).json(dailyStats);

  } catch (error) {
    console.error("Error in /getdailyrevenue:", error);
    res.status(500).json({ message: "Server error fetching daily revenue", error: error.message });
  }
});


//advnace revenue


module.exports = router;

