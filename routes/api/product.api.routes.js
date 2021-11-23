const express = require("express");
const router = express.Router();
const productControllers = require("../../controllers/api/product.api.controllers");

router.get("/categories", productControllers.getAllCategories);
router.get("/brands", productControllers.getAllBrands);
router.get("/frequencyResponses", productControllers.getAllFreqResponses);
router.get("/impedanceRanges", productControllers.getAllImpedanceRanges);
router.get("/", productControllers.getAllProducts);
router.get("/:id", productControllers.getProductById);

module.exports = router;
