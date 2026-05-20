/**
 * One-time migration: backfill the `slug` field for all MasterClass documents
 * that don't have one yet. Run once, then discard.
 * Usage: node BACKEND/scripts/backfill-masterclass-slugs.js
 */
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const MasterClass = require("../models/MasterClass");

const uri = process.env.DB_NAME || process.env.MONGO_URL || process.env.MONGODB_URI;
if (!uri) {
  console.error("❌  No MongoDB URI found in environment. Set DB_NAME in .env");
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
  await mongoose.connect(uri);
  console.log("✅  Connected to MongoDB");

  const docs = await MasterClass.find({ $or: [{ slug: { $exists: false } }, { slug: "" }] }, { title: 1 }).lean();
  console.log(`Found ${docs.length} document(s) without a slug.`);

  let updated = 0;
  for (const doc of docs) {
    const slug = slugify(doc.title);
    await MasterClass.updateOne({ _id: doc._id }, { $set: { slug } });
    console.log(`  ↳ [${doc._id}] "${doc.title}" → "${slug}"`);
    updated++;
  }

  console.log(`\n✅  Backfill complete. Updated ${updated} document(s).`);
  await mongoose.disconnect();
  process.exit(0);
})();
