const express = require("express");
const router = express.Router();

const userControllers = require("../../controllers/http/user.http.controllers");
const { isLoggedIn } = require("../../middlewares");

router.get("/", userControllers.getLoginForm);
router.get("/login", userControllers.getLoginForm);
router.get("/register", userControllers.getSignupForm);
router.get("/logout", userControllers.getLogout);
router.get("/verify/:token", userControllers.getVerifyEmail);

router.post("/login", userControllers.postLoginForm);
router.post("/register", userControllers.postSignupForm);

module.exports = router;
