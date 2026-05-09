const express = require("express");
const CreateAdvCourse = require("../models/CreateAdvCourse");
const { cachedQuery, invalidateCache } = require("../utils/cache");
const verifyAdminCookie = require("../middleware/verifyAdminCookie");
const router = express.Router();

// post request to post all the advance courses
router.post("/createadvcourse", verifyAdminCookie, async (req, res) => {
  const { title, description, show } = req.body;
  try {
    const course = new CreateAdvCourse({
      title,
      description,
      show: show !== undefined ? show : true
    });
    await course.save();

    // ✅ Invalidate courses cache when new course is created
    invalidateCache('advcourses:titles', 'static');

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to retrieve all advance courses (WITH CACHING)
router.get("/getadvcourses", async (req, res) => {
  const { courseId } = req.query
  try {
    let courses;
    if (courseId) {
      // Don't cache individual course lookups (different every time)
      courses = await CreateAdvCourse.findById(courseId);
    } else {
      // ✅ CACHE: Courses list (titles only, 5 min TTL)
      courses = await cachedQuery(
        'advcourses:titles',
        () => CreateAdvCourse.find({}, '_id title show').sort({ _id: -1 }).lean(),
        300,  // 5 minutes TTL
        'static'
      );

      // Disable browser caching for admin panel (force fresh data)
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
    }
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete request to delete selected advance course by id
router.delete("/deleteadvcourse/:_id", verifyAdminCookie, async (req, res) => {
  const { _id } = req.params;
  try {
    const courses = await CreateAdvCourse.findByIdAndDelete(_id);

    // ✅ Invalidate courses cache when course is deleted
    invalidateCache('advcourses:titles', 'static');

    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to edit selected advance course by id
router.put("/editadvcourse/:_id", verifyAdminCookie, async (req, res) => {
  const { _id } = req.params;
  const { title, description, show } = req.body;
  try {
    const course = await CreateAdvCourse.findByIdAndUpdate(
      _id,
      { title, description, show },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // ✅ Invalidate courses cache when course is edited
    invalidateCache('advcourses:titles', 'static');

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to add sessions by id
router.put("/updateadvcourse/:id", verifyAdminCookie, async (req, res) => {
  try {
    const updatedCourse = await CreateAdvCourse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error });
  }
});

//put request to add a lecture video in the modules
router.put("/updateadvcourse/:courseId", verifyAdminCookie, async (req, res) => {
  try {
    const { courseId } = req.params;
    const updatedCourse = req.body;

    const course = await CreateAdvCourse.findByIdAndUpdate(
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
