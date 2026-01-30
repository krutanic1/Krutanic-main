const CreateOperation = require("../models/CreateOperation");
const NewEnrollStudent = require("../models/NewStudentEnroll");

/**
 * Assigns an Operation Executive to a student based on logic.
 * Logic:
 * 1. Online executives only.
 * 2. Less than 15 daily assignments.
 * 3. Language match if possible.
 * 4. Load balancing (least assigned first).
 * 
 * @param {Object} student - The student document (mongoose doc or object) to assign.
 * @returns {Promise<{operationId: string, operationName: string} | null>} - Assigned op details or null.
 */
const assignExecutive = async (student) => {
    try {
        const currentHour = new Date().getHours();

        // NOTE: This utility assumes the caller checks the time window if needed.
        // However, for the cron job running at 11PM, we just want to run it.

        // 1. Fetch all active Operation Executives (Online only)
        const allOps = await CreateOperation.find({ isOnline: { $ne: false } });

        if (allOps.length === 0) {
            console.log('No online operation executives found.');
            return null;
        }

        // 2. Get today's counts for each executive
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const counts = await NewEnrollStudent.aggregate([
            { $match: { createdAt: { $gte: startOfDay } } },
            { $group: { _id: "$operationId", count: { $sum: 1 } } }
        ]);

        const countMap = {};
        counts.forEach(c => {
            if (c._id) countMap[c._id.toString()] = c.count;
        });

        const getCount = (opId) => countMap[opId.toString()] || 0;
        const MAX_DAILY_CAPACITY = 15;

        // Enhance ops with current count
        const languages = student.languages;

        const opsWithCount = allOps.map(op => ({
            doc: op,
            count: getCount(op._id),
            hasLanguage: (languages && Array.isArray(languages) && op.languages && Array.isArray(op.languages))
                ? languages.some(l => op.languages.includes(l))
                : false
        }));

        // Strategy A: Find Language Match AND Under Capacity
        let candidates = opsWithCount.filter(item => item.hasLanguage && item.count < MAX_DAILY_CAPACITY);
        let assignedOp = null;

        if (candidates.length > 0) {
            // Sort by count ascending
            candidates.sort((a, b) => a.count - b.count);
            assignedOp = candidates[0];
            console.log(`[Auto-Assign] Language Match: ${assignedOp.doc.fullname} (Count: ${assignedOp.count})`);
        } else {
            // Strategy B: Fallback - Any Under Capacity
            candidates = opsWithCount.filter(item => item.count < MAX_DAILY_CAPACITY);

            if (candidates.length > 0) {
                candidates.sort((a, b) => a.count - b.count);
                assignedOp = candidates[0];
                console.log(`[Auto-Assign] Fallback Capacity: ${assignedOp.doc.fullname} (Count: ${assignedOp.count})`);
            } else {
                // Strategy C: Absolute Fallback - Least Loaded Overall
                opsWithCount.sort((a, b) => a.count - b.count);
                assignedOp = opsWithCount[0];
                console.log(`[Auto-Assign] Global Fallback: ${assignedOp.doc.fullname} (Count: ${assignedOp.count})`);
            }
        }

        if (assignedOp) {
            return {
                operationId: assignedOp.doc._id,
                operationName: assignedOp.doc.fullname
            };
        }

        return null;

    } catch (error) {
        console.error("Error in assignExecutive util:", error);
        return null;
    }
};

module.exports = assignExecutive;
