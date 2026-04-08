const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "BACKEND/.env") });

const MicroCourse = require("./BACKEND/models/MicroCourse");
const connectDB = require("./BACKEND/config/db");

async function checkDuplicates() {
  try {
    await connectDB();
    console.log("✅ Database connected");

    const courses = await MicroCourse.find({});
    console.log(`📊 Total courses found: ${courses.length}`);

    courses.forEach(c => {
      console.log(`- [${c._id}] Title: "${c.title}"`);
      if (c.syllabusHtml) {
        console.log(`  ⚠️ Has syllabusHtml! (Length: ${c.syllabusHtml.length})`);
      }
      if (c.curriculum && c.curriculum.length > 0) {
        const firstDay = c.curriculum[0].days[0];
        if (firstDay && firstDay.learning.includes("<span")) {
          console.log(`  ❌ FOUND TAGS in curriculum: ${firstDay.learning.substring(0, 100)}...`);
        }
      }
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDuplicates();
