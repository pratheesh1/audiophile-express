const express = require("express");
const router = express.Router();

const productControllers = require("../../controllers/http/product.http.controllers");

router.get("/add", productControllers.getAddProduct);
router.get("/home", productControllers.getHome);
router.get("/:id/delete", productControllers.getDeleteProduct);
router.get("/add/image/:id", productControllers.getAddImage);
router.get("/add/tag/:id", productControllers.getAddTag);
router.get("/delete/:productId/:tagId", productControllers.getDeleteTag);

router.post("/add", productControllers.postAddProduct);
router.post("/add/image/:id", productControllers.postAddImage);
router.post("/add/tag/:id", productControllers.postAddTag);

module.exports = router;
