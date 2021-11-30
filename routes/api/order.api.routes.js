const express = require("express");
const router = express.Router();
const orderControllers = require("../../controllers/api/order.api.controllers");

router.get("/", orderControllers.getOrders);

module.exports = router;
