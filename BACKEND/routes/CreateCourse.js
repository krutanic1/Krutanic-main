const express = require("express");
const CreateCourse = require("../models/CreateCourse");
const router = express.Router();

// post request to post all the courses
router.post("/createcourse", async (req, res) => {
  const { title, description } = req.body;
  try {
    const course = new CreateCourse({
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
router.get("/getcourses", async (req, res) => {
  const {courseId} = req.query
  try {
    let courseId;
   if(courseId){
     courses = await CreateCourse.findById(courseId);
   
   } else{
     courses = await CreateCourse.find().sort({ _id: -1 });
   }
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete request to delete selected course by id
router.delete("/deletecourse/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const courses = await CreateCourse.findByIdAndDelete(_id);
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to edit selected course by id
router.put("/editcourse/:_id", async (req, res) => {
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

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//put request to add a sessions by id
router.put("/updatecourse/:id", async (req, res) => {
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
router.put("/updatecourse/:courseId", async (req, res) => {
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