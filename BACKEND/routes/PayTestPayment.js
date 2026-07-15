const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// ──────────────────────────────────────────────────────────────────────────────
// TEST PAYMENT ROUTE  —  amount fixed at ₹1 (100 paise)
// Use this route ONLY for testing the end-to-end payment flow.
// Never expose this route publicly in production.
// ──────────────────────────────────────────────────────────────────────────────

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'IQqR0sXy2dDk1gqgD2V8b6J1'
});

// POST /api/paytest-payment/create-order  →  creates a ₹1 Razorpay order
router.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: 100, // ₹1 in paise  (change here if you need a different test amount)
            currency: 'INR',
            receipt: `paytest_${Date.now()}`
        };
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('PayTest: Error creating order:', error);
        res.status(500).json({ success: false, message: 'Failed to create test order' });
    }
});

// POST /api/paytest-payment/verify-payment  →  verifies Razorpay signature
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    try {
        const secret = process.env.RAZORPAY_KEY_SECRET || 'IQqR0sXy2dDk1gqgD2V8b6J1';
        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.status(200).json({ success: true, message: 'Test payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('PayTest: Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Failed to verify test payment' });
    }
});

// GET /api/paytest-payment/check-order/:orderId  →  mobile UPI recovery check
router.get('/check-order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId || !orderId.startsWith('order_')) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }

        const payments = await razorpayInstance.orders.fetchPayments(orderId);

        const successfulPayment = payments.items?.find(
            p => p.status === 'captured' || p.status === 'authorized'
        );

        if (successfulPayment) {
            const secret = process.env.RAZORPAY_KEY_SECRET || 'IQqR0sXy2dDk1gqgD2V8b6J1';
            const body = orderId + '|' + successfulPayment.id;
            const signature = crypto
                .createHmac('sha256', secret)
                .update(body.toString())
                .digest('hex');

            res.status(200).json({
                success: true,
                paid: true,
                payment: {
                    razorpay_payment_id: successfulPayment.id,
                    razorpay_order_id: orderId,
                    razorpay_signature: signature
                }
            });
        } else {
            res.status(200).json({ success: true, paid: false });
        }
    } catch (error) {
        console.error('PayTest: Error checking order:', error);
        res.status(500).json({ success: false, message: 'Failed to check test order' });
    }
});

module.exports = router;
