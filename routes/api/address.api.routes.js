const express = require("express");
const router = express.Router();
const addressControllers = require("../../controllers/api/address.api.controllers");

router.get("/countries", addressControllers.getCountries);

router.post("/create", addressControllers.addAddress);

module.exports = router;
