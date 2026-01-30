const express = require('express');
const router = express.Router();
const assignExecutive = require('../utils/assignExecutive');
const NewEnrollStudent = require('../models/NewStudentEnroll');

// Endpoint triggered by Vercel Cron
router.get('/api/cron/auto-assign', async (req, res) => {
    console.log('⏰ Running Vercel Cron: Auto-Assign');

    try {
        // Find students with NO operationId assigned
        const unassignedStudents = await NewEnrollStudent.find({
            operationId: { $in: [null, undefined] }
        });

        console.log(`Found ${unassignedStudents.length} unassigned students.`);
        const results = [];

        for (const student of unassignedStudents) {
            const assignment = await assignExecutive(student);

            if (assignment) {
                student.operationId = assignment.operationId;
                student.operationName = assignment.operationName;
                await student.save();
                results.push(`Assigned ${student.email} to ${assignment.operationName}`);
                console.log(`✓ Auto-assigned ${student.email} to ${assignment.operationName}`);
            } else {
                results.push(`Skipped ${student.email} (No capacity/match)`);
            }
        }

        res.status(200).json({
            success: true,
            message: `Processed ${unassignedStudents.length} students`,
            details: results
        });

    } catch (error) {
        console.error('Error in Auto-Assign Cron Route:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
