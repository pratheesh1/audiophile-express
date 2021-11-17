const express = require("express");
const router = express.Router();

const userControllers = require("../../controllers/http/user.http.controllers");

router.get("/login", userControllers.getLoginForm);

module.exports = router;
