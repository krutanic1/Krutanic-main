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
    await convertExcel(newStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

const convertExcel = async (studentData) => {
  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzNjOLLASJArLOojBwDoNMkYaHYBqRf-nq5_e4esAl5epYN9chf3RjAZP2eyhc5iXUi/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
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
      }
    );
    if (response.ok) {
      console.log("Form submitted successfully!");
    } else {
      throw new Error("Failed to submit form");
    }
  } catch (error) {
    console.error("Error in convertExcel:", error);
  }
};

/**
 * GET /getnewstudentenroll
 * 
 * Retrieve student enrollments with optional filtering and pagination.
 * 
 * Query Parameters:
 * @param {string} [studentenrollid] - Fetch specific enrollment by ID
 * @param {number} [limit=100] - Maximum records to return (default: 100)
 * @param {string} [all] - Set to 'true' to bypass limit and fetch all records
 * @param {string} [month] - Filter by month name (e.g., "January")
 * @param {string} [year] - Filter by year (e.g., "2025")
 * @param {string} [startDate] - Custom date range start (ISO 8601)
 * @param {string} [endDate] - Custom date range end (ISO 8601)
 * 
 * Default Behavior:
 * - NO limit parameter → Returns first 100 records (prevents accidental full-table scans)
 * - limit=50 → Returns 50 records
 * - limit=0 OR all=true → Returns ALL records (use with caution on large datasets)
 * 
 * Response Format (Current):
 * - Array of enrollment objects
 * 
 * Recommended Response Format (Future Enhancement):
 * {
 *   "data": [...],
 *   "meta": {
 *     "appliedLimit": 100,
 *     "returnedCount": 100,
 *     "hasMore": true,
 *     "totalRecords": 5432  // Optional, expensive to compute
 *   }
 * }
 * 
 * Examples:
 * - GET /getnewstudentenroll → First 100 records
 * - GET /getnewstudentenroll?limit=50 → First 50 records
 * - GET /getnewstudentenroll?all=true → All records (potentially slow!)
 * - GET /getnewstudentenroll?month=January&year=2025 → All January 2025 records (up to 100)
 * - GET /getnewstudentenroll?startDate=2025-01-01&endDate=2025-01-31&limit=500 → Custom range, 500 max
 */
router.get("/getnewstudentenroll", async (req, res) => {
  const { studentenrollid, limit, all } = req.query;
  try {
    let StudentEnroll;

    // CASE 1: Fetch single enrollment by ID
    if (studentenrollid) {
      StudentEnroll = await NewEnrollStudent.findById(studentenrollid).lean();
      if (!StudentEnroll) {
        return res
          .status(404)
          .json({ message: "Student Eroll not found for the given userId" });
      }
    } else {
      // CASE 2: Fetch multiple enrollments with optional filtering

      // Build MongoDB query filter
      let query = {};

      const { month, year, startDate, endDate } = req.query;

      // Date Filtering Logic
      if (startDate && endDate) {
        // Custom Date Range Filter
        query.createdAt = {
          $gte: new Date(startDate), // Start of day
          $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // End of day
        };
      } else if (month && year) {
        // Specific Month Filter
        const monthIndex = new Date(`${month} 1, 2000`).getMonth(); // Parse month name to index
        const startOfMonth = new Date(year, monthIndex, 1);
        const endOfMonth = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

        query.createdAt = {
          $gte: startOfMonth,
          $lte: endOfMonth
        };
      }

      // ========================================
      // PAGINATION LOGIC - DEFAULT LIMIT: 100
      // ========================================
      // 
      // Behavior:
      // - all=true OR limit=0 → No limit (fetch all matching records)
      // - limit=<number> → Fetch exactly that many records
      // - NO limit parameter → DEFAULT to 100 records (SAFETY FEATURE)
      //
      // Rationale:
      // Without a default limit, a single API call could accidentally load
      // 10,000+ records, causing:
      //   - Memory exhaustion in serverless functions
      //   - Slow response times (2-5 seconds)
      //   - High MongoDB connection hold time
      //   - Poor user experience
      //
      // The 100-record default is a conservative safety net that:
      //   - Handles most dashboard/list use cases
      //   - Prevents accidental DoS from client bugs
      //   - Keeps response times <500ms
      //
      const queryLimit = all === 'true' || limit === '0'
        ? 0                      // No limit: fetch all
        : (parseInt(limit) || 100); // Explicit limit or DEFAULT 100

      // ========================================
      // CONDITIONAL CACHING FOR DASHBOARD QUERY
      // ========================================
      // Only cache if:
      // 1. No specific filters (default query)
      // 2. limit=1000 (AdminDashboard specific query)
      // This is the most frequent query pattern
      const isCacheable = !month && !year && !startDate && !endDate && limit === '1000';

      if (isCacheable) {
        // ✅ CACHE: Dashboard query (real-time data, short 60 sec TTL)
        const { cachedQuery } = require('../utils/cache');

        StudentEnroll = await cachedQuery(
          'enrollments:dashboard:1000',
          () => NewEnrollStudent.find(query)
            .sort({ createdAt: -1 })
            .limit(1000)
            .lean(),
          60,  // 1 minute TTL (tolerant of slight staleness)
          'dynamic'
        );

        // Add HTTP cache header for browser caching
        res.set('Cache-Control', 'public, max-age=60');
      } else if (queryLimit > 0) {
        // Apply limit (most common path, not cached due to varying queries)
        StudentEnroll = await NewEnrollStudent.find(query)
          .sort({ createdAt: -1 })
          .limit(queryLimit)
          .lean();
      } else {
        // No limit - fetch ALL matching records
        // ⚠️ WARNING: Can be slow on large collections (5000+ docs)
        StudentEnroll = await NewEnrollStudent.find(query)
          .sort({ createdAt: -1 })
          .lean();
      }
    }

    // ========================================
    // CURRENT RESPONSE FORMAT
    // ========================================
    // Returns: Array of enrollment objects
    // 
    // LIMITATION: Client cannot determine if more records exist
    //
    res.status(200).json(StudentEnroll);

    // ========================================
    // RECOMMENDED RESPONSE FORMAT (Future)
    // ========================================
    // Uncomment and modify when ready to enhance API:
    //
    // res.status(200).json({
    //   data: StudentEnroll,
    //   meta: {
    //     appliedLimit: queryLimit || null,
    //     returnedCount: StudentEnroll.length,
    //     hasMore: queryLimit > 0 && StudentEnroll.length === queryLimit,
    //     // totalRecords: await NewEnrollStudent.countDocuments(query) // Expensive!
    //   }
    // });
    //
  } catch (error) {
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
    // ✅ OPTIMIZATION: Single aggregation query with $lookup (eliminates N+1 pattern)
    // ✅ PAYLOAD OPTIMIZATION: Use $lookup pipeline to fetch only essential course fields
    // Old: 1 + N queries (N = number of enrollments)
    // New: 1 aggregation query with selective field projection
    const enrollments = await NewEnrollStudent.aggregate([
      { $match: { email: userEmail } },
      {
        $lookup: {
          from: 'createcourses',
          localField: 'domainId',
          foreignField: '_id',
          // ✅ Use pipeline to project only essential fields
          pipeline: [
            {
              $project: {
                _id: 1,
                title: 1,
                description: 1,
                // Return counts instead of full arrays to reduce payload
                modulesCount: { $size: { $ifNull: ['$modules', []] } },
                sessionsCount: { $size: { $ifNull: ['$sessions', []] } },
                createdAt: 1,
                updatedAt: 1
              }
            }
          ],
          as: 'domain'
        }
      },
      {
        $unwind: {
          path: '$domain',
          preserveNullAndEmptyArrays: true  // Keep enrollments even if course not found
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json(enrollments);
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

// Route to get aggregated monthly revenue stats
router.get("/getmonthlyrevenue", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit
    const skip = (page - 1) * limit;

    // Improved Aggregation with Lead Counts and Pagination
    const aggregationPipeline = [
      {
        $addFields: {
          monthDate: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
          isCredited: {
            $or: [
              { $eq: ["$status", "fullPaid"] },
              { $in: ["Half_Cleared", { $ifNull: ["$remark", []] }] }
            ]
          }
        }
      },
      {
        $group: {
          _id: "$monthDate",
          totalRevenue: { $sum: { $ifNull: ["$programPrice", 0] } },
          bookedRevenue: { $sum: { $ifNull: ["$paidAmount", 0] } },
          creditedRevenue: {
            $sum: {
              $cond: ["$isCredited", { $ifNull: ["$paidAmount", 0] }, 0]
            }
          },
          pendingRevenue: { $sum: { $subtract: [{ $ifNull: ["$programPrice", 0] }, { $ifNull: ["$paidAmount", 0] }] } },
          payments: { $sum: 1 },
          leads: { $push: "$lead" },
          // Sort helper
          originalDate: { $max: "$createdAt" }
        }
      },
      { $sort: { originalDate: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          grandTotal: [
            { $group: { _id: null, totalRevenue: { $sum: "$totalRevenue" } } }
          ],
          data: [{ $skip: skip }, { $limit: limit }]
        }
      }
    ];

    const result = await NewEnrollStudent.aggregate(aggregationPipeline);

    // Extract metadata and data
    const metadata = result[0].metadata[0] || { total: 0 };
    const grandTotalData = result[0].grandTotal[0] || { totalRevenue: 0 };
    const advancedStats = result[0].data;

    // Process leads count
    const finalStats = advancedStats.map(stat => {
      const leadCounts = {};
      stat.leads.forEach(lead => {
        if (lead) leadCounts[lead] = (leadCounts[lead] || 0) + 1;
      });
      return {
        month: stat._id,
        total: stat.totalRevenue,
        booked: stat.bookedRevenue,
        credited: stat.creditedRevenue,
        pending: stat.totalRevenue - stat.creditedRevenue,
        payments: stat.payments,
        paymentsByLead: leadCounts
      };
    });

    res.status(200).json({
      data: finalStats,
      pagination: {
        total: metadata.total,
        grandTotal: grandTotalData.totalRevenue,
        page,
        limit,
        totalPages: Math.ceil(metadata.total / limit)
      }
    });
  } catch (error) {
    console.error("Aggregation Error:", error);
    res.status(500).json({ error: "Failed to fetch revenue stats" });
  }
});

module.exports = router;
