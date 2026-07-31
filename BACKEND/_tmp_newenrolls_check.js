const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

function monthToNumber(value) {
  const v = String(value).trim().toLowerCase();
  const map = { jan:1, january:1, feb:2, february:2, mar:3, march:3, apr:4, april:4, may:5, jun:6, june:6, jul:7, july:7, aug:8, august:8, sep:9, sept:9, september:9, oct:10, october:10, nov:11, november:11, dec:12, december:12 };
  return map[v] || null;
}

function computeIsoDate(raw) {
  if (raw == null) return null;
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return new Date(Date.UTC(raw.getUTCFullYear(), raw.getUTCMonth(), 1)).toISOString().slice(0,10);
  }
  const s = String(raw).trim();
  if (!s) return null;
  const direct = new Date(s);
  if (!Number.isNaN(direct.getTime())) {
    return new Date(Date.UTC(direct.getUTCFullYear(), direct.getUTCMonth(), 1)).toISOString().slice(0,10);
  }
  const parts = s.split(/[\s\/-]+/).filter(Boolean);
  if (parts.length === 2) {
    let year = null; let month = null;
    if (/^\d{4}$/.test(parts[0])) { year = Number(parts[0]); month = monthToNumber(parts[1]) || Number(parts[1]); }
    else if (/^\d{4}$/.test(parts[1])) { year = Number(parts[1]); month = monthToNumber(parts[0]) || Number(parts[0]); }
    if (year && month >= 1 && month <= 12) return new Date(Date.UTC(year, month - 1, 1)).toISOString().slice(0,10);
  }
  return null;
}

(async () => {
  try {
    if (!process.env.MONGO_URI) { console.log('MONGO_URI is missing from .env'); process.exit(1); }
    await mongoose.connect(process.env.MONGO_URI);
    const collection = mongoose.connection.db.collection('newenrolls');
    const doc = await collection.findOne({}, { sort: { _id: -1 }, projection: { internshipstartsmonth: 1, monthOpted: 1 } });
    if (!doc) { console.log('No documents found in collection newenrolls.'); process.exit(0); }
    const fieldName = doc.internshipstartsmonth != null ? 'internshipstartsmonth' : (doc.monthOpted != null ? 'monthOpted' : null);
    if (!fieldName) {
      console.log('Latest document found, but both internshipstartsmonth and monthOpted are missing.');
      console.log(`Latest document _id: ${doc._id}`);
      process.exit(0);
    }
    const rawValue = doc[fieldName];
    const isoDate = computeIsoDate(rawValue);
    console.log(`Latest document _id: ${doc._id}`);
    console.log(`Field used: ${fieldName}`);
    console.log(`Raw value: ${JSON.stringify(rawValue)}`);
    if (isoDate) console.log(`Computed ISO date: ${isoDate}`);
    else console.log('Could not compute an ISO date from the field value using day 01.');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message || error);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
})();
