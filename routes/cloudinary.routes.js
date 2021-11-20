const express = require("express");
const router = express.Router();
const controllers = require("../controllers/cloudinary.controllers");

router.get("/sign", controllers.signCloudinary);

module.exports = router;
