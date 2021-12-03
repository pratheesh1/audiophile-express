const express = require("express");
const router = express.Router();

const orderControllers = require("../../controllers/http/order.http.controllers");

router.get("/", orderControllers.getAllOrders);
router.get("/:orderId", orderControllers.getAllOrders);

router.get(
  "/orderItem/updateStatus/:orderId/:orderItemId/:statusId",
  orderControllers.updateOrderItemStatus
);

module.exports = router;
