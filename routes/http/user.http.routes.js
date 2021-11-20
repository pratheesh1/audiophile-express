const express = require("express");
const router = express.Router();

const userControllers = require("../../controllers/http/user.http.controllers");

router.get("/login", userControllers.getLoginForm);
router.get("/register", userControllers.getSignupForm);
router.get("/logout", userControllers.getLogout);

router.post("/login", userControllers.postLoginForm);
router.post("/register", userControllers.postSignupForm);

module.exports = router;
