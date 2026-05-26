const mongoose = require("mongoose");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const MasterClass = require("../models/MasterClass");

const uri = process.env.DB_NAME || process.env.MONGO_URL || process.env.MONGODB_URI;
if (!uri) {
  console.error("No MongoDB URI found in environment.");
  process.exit(1);
}

const slugify = (text) => {
  if (!text) return "";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

(async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const docs = await MasterClass.find({}).lean();
    console.log(`Found ${docs.length} total documents.`);

    let updated = 0;
    for (const doc of docs) {
      const correctSlug = slugify(doc.title);
      if (doc.slug !== correctSlug) {
        await MasterClass.updateOne({ _id: doc._id }, { $set: { slug: correctSlug } });
        console.log(`Updated [${doc._id}]:`);
        console.log(`  Old slug: "${doc.slug}"`);
        console.log(`  New slug: "${correctSlug}"`);
        updated++;
      }
    }

    console.log(`\nFix complete. Updated ${updated} document(s).`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
