const express = require("express");
const CreateCourse = require("../models/CreateCourse");
const { cachedQuery, invalidateCache } = require("../utils/cache");
const verifyAdminCookie = require("../middleware/verifyAdminCookie");
const router = express.Router();

// post request to post all the courses
router.post("/createcourse", verifyAdminCookie, async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = new CreateCourse({
      title,
      description,
    });
    await course.save();

    // ✅ Invalidate courses cache when new course is created
    invalidateCache('courses:titles', 'static');

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all courses (WITH CACHING)
router.get("/getcourses", async (req, res) => {
  const { courseId } = req.query
  try {
    let courses;
    if (courseId) {
      // Don't cache individual course lookups (different every time)
      courses = await CreateCourse.findById(courseId);
    } else {
      // ✅ CACHE: Courses list (titles only, 5 min TTL)
      courses = await cachedQuery(
        'courses:titles',
        () => CreateCourse.find({}, '_id title').sort({ _id: -1 }).lean(),
        300,  // 5 minutes TTL
        'static'
      );

      // Filter out commented out courses
      if (Array.isArray(courses)) {
        const coursesToExclude = [
          "Automation Testing",
          "Supply Chain Management",
          "Fintech",
          "Psychology",
          "Nano Technology & Genetic Engineering"
        ];
        courses = courses.filter(course => !coursesToExclude.includes(course.title));
      }

      // Add HTTP cache header for browser caching
      res.set('Cache-Control', 'public, max-age=300');
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete request to delete selected course by id
router.delete("/deletecourse/:_id", verifyAdminCookie, async (req, res) => {
  const { _id } = req.params;
  try {
    const courses = await CreateCourse.findByIdAndDelete(_id);

    // ✅ Invalidate courses cache when course is deleted
    invalidateCache('courses:titles', 'static');

    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to edit selected course by id
router.put("/editcourse/:_id", verifyAdminCookie, async (req, res) => {
  const { _id } = req.params;
  const { title, description } = req.body;

  try {
    const course = await CreateCourse.findByIdAndUpdate(
      _id,
      { title, description },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Invalidate courses cache when course is edited
    invalidateCache('courses:titles', 'static');

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to add a sessions by id
router.put("/updatecourse/:id", verifyAdminCookie, async (req, res) => {
  try {
    const updatedCourse = await CreateCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

//put request to add a lecture video in the moduls
router.put("/updatecourse/:courseId", verifyAdminCookie, async (req, res) => {
  try {
    const { courseId } = req.params;
    const updatedCourse = req.body;

    const course = await CreateCourse.findByIdAndUpdate(
      courseId,
      updatedCourse,
      {
        new: true,
      }
    );

    if (!course) {
      return res.status(404).send("Course not found");
    }

    res.status(200).send(course);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;