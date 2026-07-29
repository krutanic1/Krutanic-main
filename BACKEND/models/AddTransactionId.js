const mongoose = require('mongoose');

const AddTransactionIdSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        unique: true,
    },
    fullname: {
        type: String,
    },
    counselor: {
        type: String,
    },
    lead: {
        type: String,
    },
    executiveId: {
        type: String,
    },
    executive: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastReminderSentAt: {
        type: Date,
    },
    reminderCount: {
        type: Number,
        default: 0,
    },

});

module.exports = mongoose.model('AddTransactionId', AddTransactionIdSchema);