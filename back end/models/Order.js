const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  total: Number,
  paymentId: String,
  orderId: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Order", orderSchema);
