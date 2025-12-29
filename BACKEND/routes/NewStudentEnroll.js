const express = require("express");
const router = express.Router();
const CreateBDA = require("../models/CreateBDA");
const NewEnrollStudent = require("../models/NewStudentEnroll");
const CreateCourse = require("../models/CreateCourse");
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
      yearOfStudy
    });

    await newStudent.save();
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

// GET request to retrieve all new student enroll
router.get("/getnewstudentenroll", async (req, res) => {
  const { studentenrollid } = req.query;
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
    } else {                                                                //.limit(700)
      StudentEnroll = await NewEnrollStudent.find().sort({ createdAt: -1 }).lean();
    }
    res.status(200).json(StudentEnroll);
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
