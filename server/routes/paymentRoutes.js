// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Giá trị đơn hàng từ frontend gửi lên

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Tính bằng đơn vị nhỏ nhất (vd: VNĐ thì để nguyên, USD thì nhân 100)
      currency: 'vnd',
      payment_method_types: ['card'],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;