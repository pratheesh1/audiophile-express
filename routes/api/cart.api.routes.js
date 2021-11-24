const express = require("express");
const router = express.Router();
const cartControllers = require("../../controllers/api/cart.api.controllers");

router.get("/", cartControllers.getCart);

router.post("/add", cartControllers.addToCart);
router.post("/update", cartControllers.updateCartQuantity);
router.delete("/remove", cartControllers.removeFromCart);

module.exports = router;
