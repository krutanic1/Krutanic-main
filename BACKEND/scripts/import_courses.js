const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load backend .env for MongoDB URI
dotenv.config({ path: path.join(__dirname, "../.env") });

const MicroCourse = require("../models/MicroCourse");
const connectDB = require("../config/db");

const COURSES_DIR = path.join(__dirname, "../../new-project/coursedetails");

const CATEGORY_MAP = {
  finance: ["amalgation", "inventory"],
  business: ["entrepreneur"],
  tech: ["javascript", "kubernetes", "php", "database", "webscraping", "statistics"]
};

function getCategory(filename) {
  const name = filename.toLowerCase();
  if (CATEGORY_MAP.finance.some(key => name.includes(key))) return "finance";
  if (CATEGORY_MAP.business.some(key => name.includes(key))) return "business";
  return "tech";
}

function stripHtml(html, removeEmojis = false) {
  if (!html) return "";
  let clean = html
    .replace(/<[^>]+>/g, "")   // Robust tag removal
    .replace(/&nbsp;/g, " ")   // Replace non-breaking spaces
    .replace(/&amp;/g, "&")    // Replace ampersands
    .replace(/&gt;/g, ">")     // Replace greater than
    .replace(/&lt;/g, "<")     // Replace less than
    .replace(/\[reference:\d+\]/g, "") // Remove references like [reference:0]
    .replace(/\s+/g, " ")      // Normalize spaces
    .trim();
  
  if (removeEmojis) {
    clean = clean.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "");
  }
  
  return clean.trim();
}

async function importCourses() {
  try {
    await connectDB();
    console.log("✅ Database connected");

    // CLEAR OLD COURSES TO RESOLVE DUPLICATES AND ENSURE CLEAN TITLES
    console.log("🧹 Clearing existing micro-courses...");
    await MicroCourse.deleteMany({});
    console.log("✅ Collection cleared");

    const files = fs.readdirSync(COURSES_DIR).filter(f => f.endsWith(".html"));
    console.log(`📂 Found ${files.length} HTML files`);

    for (const file of files) {
      const content = fs.readFileSync(path.join(COURSES_DIR, file), "utf-8");
      
      // Extract Title
      const titleMatch = content.match(/<h1>([\s\S]*?)<\/h1>/);
      let title = titleMatch ? stripHtml(titleMatch[1], true) : "";

      // Extract Description
      const descMatch = content.match(/<p style="margin-bottom: 28px; color: #2c5a7a;">([\s\S]*?)<\/p>/) || 
                        content.match(/<p.*?>([\s\S]*?)<\/p>/);
      const description = descMatch ? stripHtml(descMatch[1], true) : "";

      // Structured Curriculum Extraction
      const curriculum = [];
      const weekParts = content.split('<div class="week-card">').slice(1);
      
      for (const part of weekParts) {
        const weekTitleMatch = part.match(/<div class="week-title">([\s\S]*?)<\/div>/);
        const weekTitle = weekTitleMatch ? stripHtml(weekTitleMatch[1]) : "Unit";
        
        const days = [];
        const dayParts = part.split('<div class="day-item');
        for (let i = 1; i < dayParts.length; i++) {
          const dayPart = dayParts[i];
          const isSunday = dayPart.includes('sunday');
          
          const dayNameMatch = dayPart.match(/<span class="day-name">([\s\S]*?)<\/span>/);
          const topicMatch = dayPart.match(/<span class="topic">([\s\S]*?)<\/span>/);
          const learningMatch = dayPart.match(/<div class="learning">([\s\S]*?)<\/div>/);
          const projectBadgeMatch = dayPart.match(/<div class="project-badge">([\s\S]*?)<\/div>/);
          
          if (dayNameMatch) {
            let dayName = stripHtml(dayNameMatch[1]);
            // Advanced Cleaning for Sunday Labels
            if (isSunday) {
              dayName = dayName
                .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // Emojis
                .replace(/SUNDAY\s*[–-]\s*(Project\s*\d+\s*:\s*)?/i, "") // Redundant context
                .trim();
            }

            days.push({
              dayName: dayName,
              topic: topicMatch ? stripHtml(topicMatch[1]) : "Topic",
              learning: learningMatch ? stripHtml(learningMatch[1]) : "",
              projectBadge: projectBadgeMatch ? stripHtml(projectBadgeMatch[1]) : null,
              isSunday
            });
          }
        }
        
        if (days.length > 0) {
          curriculum.push({ weekTitle, days });
        }
      }

      // Flatten curriculum into sessions as well
      const sessions = [];
      curriculum.forEach(week => {
        week.days.forEach(day => {
          sessions.push({
            sessionName: `${day.dayName}: ${day.topic}`,
            driveFileId: ""
          });
        });
      });

      const category = getCategory(file);
      const thumbnailPath = `/thumbnails/${category}.png`;

      const courseData = {
        title,
        description,
        sessions,
        curriculum,
        thumbnail: thumbnailPath,
        price: 5000,
        rating: 4.5
      };

      // Create new clean course record
      await MicroCourse.create(courseData);

      console.log(`✨ Imported: ${title} (${category})`);
    }

    console.log("🏁 Migration Complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration Failed:", error);
    process.exit(1);
  }
}

importCourses();
