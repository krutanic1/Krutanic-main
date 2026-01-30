require('dotenv').config();
const mongoose = require('mongoose');
const { sendPaymentReminders } = require('./services/paymentReminderService');

/**
 * Test script for payment reminder system
 * Run with: node test_payment_reminders.js
 */
async function testPaymentReminders() {
    try {
        console.log('🧪 Testing Payment Reminder System...\n');

        // Connect to MongoDB
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(process.env.DB_NAME);
        console.log('✅ Connected to MongoDB\n');

        // Run payment reminders
        console.log('📧 Sending payment reminders...');
        const result = await sendPaymentReminders();

        // Display results
        console.log('\n📊 Results:');
        console.log('─'.repeat(50));
        console.log(`Success: ${result.success}`);
        console.log(`Emails Sent: ${result.sent || 0}`);
        console.log(`Emails Failed: ${result.failed || 0}`);
        if (result.error) {
            console.log(`Error: ${result.error}`);
        }
        console.log('─'.repeat(50));

        // Disconnect
        await mongoose.disconnect();
        console.log('\n✅ Test completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run the test
testPaymentReminders();
