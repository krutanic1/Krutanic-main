const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Create Razorpay instance using dummy keys if env is not set
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_1DP5mmOlF5G5ag',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'IQqR0sXy2dDk1gqgD2V8b6J1'
});

router.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: 10100, // ₹101 in paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, message: 'Failed to create order' });
    }
});

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
            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ success: false, message: 'Failed to verify payment' });
    }
});

// Check if an order was paid (for mobile UPI recovery when JS handler doesn't fire)
router.get('/check-order/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId || !orderId.startsWith('order_')) {
            return res.status(400).json({ success: false, message: 'Invalid order ID' });
        }

        // Fetch all payments for this order from Razorpay
        const payments = await razorpayInstance.orders.fetchPayments(orderId);
        
        // Find the first successful payment
        const successfulPayment = payments.items?.find(
            p => p.status === 'captured' || p.status === 'authorized'
        );

        if (successfulPayment) {
            // Generate signature for verification
            const crypto = require('crypto');
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
        console.error('Error checking order status:', error);
        res.status(500).json({ success: false, message: 'Failed to check order status' });
    }
});

module.exports = router;
