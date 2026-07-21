/**
 * restore_leads.js
 * ---------------------------------------------------------------
 * PURPOSE: Finds all AdvLeads that were re-assigned TODAY and whose
 *          previous owner was either avanish_sharma or deepti_moyee,
 *          then restores them back to those original owners.
 *
 * Run from BACKEND folder:
 *   node restore_leads.js
 * ---------------------------------------------------------------
 */

require("dotenv").config();
const mongoose = require("mongoose");

// ── Models ──────────────────────────────────────────────────────
const AdvLead = require("./models/AdvLead");
const AdvTeam = require("./models/CreateAdvTeam"); // email-based team members

// ── CONFIG ──────────────────────────────────────────────────────
const TARGET_EMAILS = [
    "avanish_sharma@krutanic.org",
    "deepti_moyee@krutanic.org"
];

async function main() {
    // 1. Connect to DB
    await mongoose.connect(process.env.DB_NAME);
    console.log("✅ Connected to MongoDB\n");

    // 2. Find the two team members by email
    const members = await AdvTeam.find({ email: { $in: TARGET_EMAILS } }).lean();
    if (members.length === 0) {
        console.error("❌ No team members found for the given emails. Check the email addresses.");
        process.exit(1);
    }

    console.log("👤 Found team members:");
    members.forEach(m => console.log(`   - ${m.fullname} (${m.email})  ID: ${m._id}`));
    console.log();

    // Build a map: id_string → member doc
    const memberById = {};
    members.forEach(m => { memberById[m._id.toString()] = m; });
    const memberIds = members.map(m => m._id.toString());

    // 3. Build "today" date range (IST midnight → now)
    //    The server runs in UTC so we compute today's IST window in UTC
    const now = new Date();
    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // +05:30
    const nowIST = new Date(now.getTime() + IST_OFFSET_MS);
    const todayISTMidnight = new Date(
        Date.UTC(nowIST.getUTCFullYear(), nowIST.getUTCMonth(), nowIST.getUTCDate())
        - IST_OFFSET_MS
    ); // UTC timestamp that equals IST 00:00:00 today

    console.log(`📅 Looking for leads re-assigned since: ${todayISTMidnight.toISOString()} UTC (= IST midnight)\n`);

    // 4. Find leads that:
    //    a) were assigned today  (assigned_at >= today IST midnight)
    //    b) have one of the two member IDs in old_owners  (they were previous owners)
    //    c) current owner is NOT already one of them       (they were displaced)
    const leads = await AdvLead.find({
        assigned_at: { $gte: todayISTMidnight },
        old_owners: { $in: memberIds },
        owner_id: { $nin: memberIds }          // currently someone else owns it
    }).lean();

    if (leads.length === 0) {
        console.log("ℹ️  No leads found that match today's re-assignment for these two people.");
        process.exit(0);
    }

    console.log(`🔎 Found ${leads.length} lead(s) to restore:\n`);

    let restored = 0;
    let skipped  = 0;

    for (const lead of leads) {
        // Determine which target member was the MOST-RECENT previous owner
        // old_owners is an array; the last entry that matches is the most recent one
        const matchedId = [...(lead.old_owners || [])].reverse().find(id => memberIds.includes(id));
        if (!matchedId) { skipped++; continue; }

        const member = memberById[matchedId];

        console.log(`  ↩  Restoring lead: "${lead.full_name}" (${lead._id})`);
        console.log(`     Current owner: ${lead.owner_id}  →  Restoring to: ${member.fullname} (${member._id})`);

        // Remove the matchedId from old_owners (we're putting them back as owner)
        const updatedOldOwners = (lead.old_owners || []).filter(id => id !== matchedId);

        // Restore the lead
        await AdvLead.findByIdAndUpdate(lead._id, {
            $set: {
                owner_id:       member._id.toString(),
                owner_name:     member.fullname,
                assigned_at:    now,          // mark as re-assigned now
                old_owners:     updatedOldOwners
            }
        });

        restored++;
    }

    console.log(`\n✅ Done! Restored ${restored} lead(s). Skipped ${skipped} (no matching old-owner found).`);
    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error("❌ Error:", err);
    mongoose.disconnect().then(() => process.exit(1));
});
