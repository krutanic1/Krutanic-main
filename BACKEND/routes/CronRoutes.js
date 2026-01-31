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
// Supports both GET and POST methods for compatibility
router.all('/api/cron/payment-reminders', async (req, res) => {
    const timestamp = new Date().toISOString();
    const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    console.log(`⏰ [${istTime} IST] Running Vercel Cron: Payment Reminders`);
    console.log(`📋 Request Method: ${req.method}`);
    console.log(`📋 Headers:`, {
        'x-vercel-cron': req.headers['x-vercel-cron'],
        'authorization': req.headers.authorization ? 'Present' : 'Missing'
    });

    try {
        // Security: Verify request is from Vercel Cron or has valid CRON_SECRET
        const authHeader = req.headers.authorization;
        const vercelCronHeader = req.headers['x-vercel-cron'];
        const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

        // Allow if either:
        // 1. Request has x-vercel-cron header (automatically sent by Vercel Cron), OR
        // 2. Request has valid CRON_SECRET in Authorization header
        const isVercelCron = vercelCronHeader === '1';
        const hasValidSecret = process.env.CRON_SECRET && authHeader === expectedAuth;

        if (!isVercelCron && !hasValidSecret) {
            console.error('❌ Unauthorized cron request - Missing Vercel header or valid CRON_SECRET');
            return res.status(401).json({
                error: 'Unauthorized',
                timestamp,
                hint: 'Request must include x-vercel-cron header or valid Authorization token'
            });
        }

        console.log('✅ Authorization passed:', isVercelCron ? 'Vercel Cron Header' : 'CRON_SECRET');

        // Import and execute payment reminder service
        const { sendPaymentReminders } = require('../services/paymentReminderService');
        const result = await sendPaymentReminders();

        if (result.success) {
            console.log(`✅ Payment reminders completed: ${result.sent} sent, ${result.failed} failed`);
            res.status(200).json({
                success: true,
                message: `Payment reminders sent successfully`,
                sent: result.sent,
                failed: result.failed,
                timestamp,
                istTime
            });
        } else {
            console.error(`❌ Payment reminders failed:`, result.error);
            res.status(500).json({
                success: false,
                error: result.error,
                timestamp,
                istTime
            });
        }

    } catch (error) {
        console.error('❌ Error in Payment Reminder Cron Route:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
            timestamp,
            istTime
        });
    }
});

// Test endpoint for manual triggering (no auth required for testing)
router.get('/api/cron/test-payment-reminders', async (req, res) => {
    const timestamp = new Date().toISOString();
    const istTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    console.log(`🧪 [${istTime} IST] Manual test trigger: Payment Reminders`);

    try {
        const { sendPaymentReminders } = require('../services/paymentReminderService');
        const result = await sendPaymentReminders();

        if (result.success) {
            console.log(`✅ Test completed: ${result.sent} sent, ${result.failed} failed`);
            res.status(200).json({
                success: true,
                message: `Test: Payment reminders sent successfully`,
                sent: result.sent,
                failed: result.failed,
                timestamp,
                istTime,
                note: 'This is a test endpoint. Use for debugging only.'
            });
        } else {
            console.error(`❌ Test failed:`, result.error);
            res.status(500).json({
                success: false,
                error: result.error,
                timestamp,
                istTime
            });
        }

    } catch (error) {
        console.error('❌ Error in test endpoint:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message,
            timestamp,
            istTime
        });
    }
});

module.exports = router;
