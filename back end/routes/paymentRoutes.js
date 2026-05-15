const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Order = require("../models/Order");

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, products, total } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSign === razorpay_signature) {
    const newOrder = new Order({
      userId,
      products,
      total,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "paid"
    });

    await newOrder.save();
    res.json({ message: "Payment successful" });
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
});

module.exports = router;
