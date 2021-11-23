const express = require("express");
const router = express.Router();
const userControllers = require("../../controllers/api/user.api.controllers");

router.post("/login", userControllers.login);

module.exports = router;
