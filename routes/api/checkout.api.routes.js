const express = require("express");
const router = express.Router();
const checkOutController = require("../../controllers/api/checkout.api.controller");

router.post("/", checkOutController.postCheckout);

module.exports = router;
