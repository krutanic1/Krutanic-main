const express = require("express");
const MedCourse = require("../models/MedCourse");
const verifyAdminCookie = require("../middleware/verifyAdminCookie");
const router = express.Router();

// post request to post all the courses
router.post("/createmedcourse", verifyAdminCookie, async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = new MedCourse({
      title,
      description,
    });
    await course.save();

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all courses
router.get("/getmedcourses", async (req, res) => {
  const { courseId } = req.query
  try {
    let courses;
    if (courseId) {
      courses = await MedCourse.findById(courseId);
    } else {
      courses = await MedCourse.find({}, '_id title').sort({ _id: -1 }).lean();
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete request to delete selected course by id
router.delete("/deletemedcourse/:_id", verifyAdminCookie, async (req, res) => {
  const { _id } = req.params;
  try {
    const courses = await MedCourse.findByIdAndDelete(_id);

    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to edit selected course by id
router.put("/editmedcourse/:_id", verifyAdminCookie, async (req, res) => {
  const { _id } = req.params;
  const { title, description } = req.body;

  try {
    const course = await MedCourse.findByIdAndUpdate(
      _id,
      { title, description },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to add a sessions by id
router.put("/updatemedcourse/:id", verifyAdminCookie, async (req, res) => {
  try {
    const updatedCourse = await MedCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

module.exports = router;
