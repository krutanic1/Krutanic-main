const express = require("express");
const router = express.Router();
const CreateBDA = require("../models/CreateBDA");
const NewEnrollStudent = require("../models/NewStudentEnroll");
const CreateCourse = require("../models/CreateCourse");
const TransactionId = require("../models/AddTransactionId");
const mongoose = require("mongoose");

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
      yearOfStudy
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
      operationName,
      modeofpayment,
      transactionId,
      operationId,
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
      executive: executive       // Add executive assignment from BDA
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
router.get("/getmonthlyrevenue", async (req, res) => {
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
router.get("/getnewstudentenroll", async (req, res) => {
  const { studentenrollid, month, year, startDate, endDate, all } = req.query;
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
    } else {
      let query = {};

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


      StudentEnroll = await NewEnrollStudent.find(query).sort({ createdAt: -1 }).lean();

    }
    res.status(200).json(StudentEnroll);
  } catch (error) {
    console.error("Error in /getnewstudentenroll:", error);
    res.status(500).json({
      message: "An error occurred while fetching data",
      error: error.message,
    });
  }
});

// Handle POST request to update remark for an existing student
router.post("/updateremark", async (req, res) => {
  const { remark, studentId, referRemark } = req.body;
  try {
    const existingStudent = await NewEnrollStudent.findById(studentId);
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
router.put("/editstudentdetails/:_id", async (req, res) => {
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
    whatAppNumber,
    remainingAmount,
    collegeName,
    branch,
    aadharNumber,
    referFriend,
    lead
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
        whatAppNumber,
        remainingAmount,
        collegeName,
        branch,
        aadharNumber,
        referFriend,
        lead
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
router.post("/updateStudentStatus", async (req, res) => {
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
router.post("/update-operation/:id", async (req, res) => {
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
          enrollment.domain = course || null; // Replace domainId with course data
        }
        return enrollment;
      })
    );
    // res.status(200).json(enrollments);
    res.status(200).json(updatedEnrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch enrollments", error });
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

module.exports = router;
