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

// Payment Reminder Cron Endpoint (Triggered by Vercel Cron)
router.post('/api/cron/payment-reminders', async (req, res) => {
    console.log('⏰ Running Vercel Cron: Payment Reminders');

    try {
        // Security: Verify Vercel Cron Secret
        const authHeader = req.headers.authorization;
        const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

        if (!process.env.CRON_SECRET || authHeader !== expectedAuth) {
            console.error('❌ Unauthorized cron request');
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Import and execute payment reminder service
        const { sendPaymentReminders } = require('../services/paymentReminderService');
        const result = await sendPaymentReminders();

        if (result.success) {
            res.status(200).json({
                success: true,
                message: `Payment reminders sent successfully`,
                sent: result.sent,
                failed: result.failed,
                timestamp: new Date().toISOString()
            });
        } else {
            res.status(500).json({
                success: false,
                error: result.error,
                timestamp: new Date().toISOString()
            });
        }

    } catch (error) {
        console.error('Error in Payment Reminder Cron Route:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;
