const express = require("express");
const router = express.Router();
const userControllers = require("../../controllers/api/user.api.controllers");
const { isAuthenticated } = require("../../middlewares");

router.get("/", isAuthenticated, userControllers.getUserData);
router.get("/refresh", userControllers.refreshToken);

router.post("/login", userControllers.login);
router.post("/logout", userControllers.logout);
router.post("/register", userControllers.register);

module.exports = router;
