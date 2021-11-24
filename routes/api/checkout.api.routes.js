const express = require("express");
const router = express.Router();
const checkOutController = require("../../controllers/api/checkout.api.controller");

router.get("/", checkOutController.getCheckout);
router.get("/create_order", checkOutController.createOrder);

router.post("/process_payment", checkOutController.processPayment);

module.exports = router;
