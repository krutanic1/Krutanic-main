const mongoose = require("mongoose");

const CreateCourseSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  session: {
    type: Map,
    of: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
    },
    default: {},
  },
});

const CreateCourse = mongoose.model("CreateCourse", CreateCourseSchema);

module.exports = CreateCourse;
