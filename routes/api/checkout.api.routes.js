const express = require("express");
const router = express.Router();
const checkOutController = require("../../controllers/api/checkout.api.controller");

router.post("/", checkOutController.postCheckout);
router.post("/process_payment", checkOutController.processPayment);

module.exports = router;
