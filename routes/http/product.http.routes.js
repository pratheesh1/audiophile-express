const express = require("express");
const router = express.Router();

const productControllers = require("../../controllers/http/product.http.controllers");

router.get("/add", productControllers.getAddProduct);
router.get("/home", productControllers.getHome);
router.get("/:id/delete", productControllers.getDeleteProduct);

router.post("/add", productControllers.postAddProduct);

module.exports = router;
