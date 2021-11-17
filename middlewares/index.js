const { consoleLog } = require("../signale.config");

//middleware to handle errors
exports.errorHandler = (err, req, res, next) => {
  consoleLog.error(err);
  if (err) {
    if (req.url.includes("/api")) {
      handleApiError(err, req, res);
    }
    res.status(500).send("Something went wrong! Please try again.");
  }
  next();
};

function handleApiError(err, req, res) {
  if (err.status === 400) {
    res.status(400).json({
      error: err.message,
    });
  } else if (err.status === 401) {
    res.status(401).json({
      error: err.message,
    });
  } else if (err.status === 404) {
    res.status(404).json({
      error: err.message,
    });
  } else {
    res.status(500).json({
      error: err.message,
    });
  }
}
