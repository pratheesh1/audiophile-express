const express = require("express");
const router = express.Router();
const productControllers = require("../../controllers/api/product.api.controllers");

router.get("/categories", productControllers.getAllCategories);
router.get("/brands", productControllers.getAllBrands);
router.get("/frequencyResponses", productControllers.getAllFreqResponses);
router.get("/impedanceRanges", productControllers.getAllImpedanceRanges);

router.post("/addCategory", productControllers.addNewCategory);
router.post("/addBrand", productControllers.addNewBrand);
router.post("/addFreqResponse", productControllers.addNewFreqResponse);
router.post("/addImpedanceRange", productControllers.addNewImpedanceRange);

module.exports = router;
