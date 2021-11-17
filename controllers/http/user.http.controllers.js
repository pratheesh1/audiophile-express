const consoleLog = require("../../signale.config");

//get login form
exports.getLoginForm = (req, res) => {
  res.render("users/login");
};
