const { consoleLog } = require("../signale.config");

//middleware to handle errors
exports.errorHandler = (err, req, res, next) => {
  if (err) {
    if (req.url.includes("/api/")) {
      consoleLog.error(err.message, err.stack);
      res.status(500).json({
        error: err.message,
      });
    } else {
      consoleLog.error(err.message, err.stack);
      res.status(500).send("Something went wrong! Please try again.");
    }
  } else {
    next();
  }
};
