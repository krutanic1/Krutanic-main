const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const CreateAdvCourse = require("../models/CreateAdvCourse");

async function run() {
  try {
    await mongoose.connect(process.env.DB_NAME);
    console.log("Connected to database.");

    const allowedTitles = [
      "Data Science",
      "Data Analytics",
      "Digital Marketing",
      "Product Management",
      "MERN Stack Development",
      "Prompt Engineering with GenAI"
    ];

    // Set show: true for these 6, and show: false for all others
    const res1 = await CreateAdvCourse.updateMany(
      { title: { $in: allowedTitles } },
      { $set: { show: true } }
    );
    console.log("Updated to true:", res1);

    const res2 = await CreateAdvCourse.updateMany(
      { title: { $nin: allowedTitles } },
      { $set: { show: false } }
    );
    console.log("Updated to false:", res2);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
