const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.post("/", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.body.userId });

  if (cart) {
    cart.products.push(req.body.product);
    await cart.save();
    return res.json(cart);
  }

  const newCart = new Cart({
    userId: req.body.userId,
    products: [req.body.product]
  });

  await newCart.save();
  res.json(newCart);
});

router.get("/:userId", async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.json(cart);
});

module.exports = router;
