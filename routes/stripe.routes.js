const express = require("express");
const router = express.Router();
const stripeControllers = require("../controllers/stripe.controllers");

router.post(
  "/process_payment",
  express.raw({ type: "application/json" }),
  stripeControllers.processPayment
);

module.exports = router;
