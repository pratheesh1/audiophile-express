const { consoleLog } = require("../signale.config");
const csrf = require("csurf");
const jwt = require("jsonwebtoken");

//middleware to handle errors
exports.errorHandler = (err, req, res, next) => {
  if (err) {
    consoleLog.error(err);
    if (req.url.includes("/api")) {
      handleApiError(err, req, res, next);
      return;
    }
    res.status(500).render("500/500");
    return;
  }
  res.status(404).render("404/404");
};

function handleApiError(err, req, res, next) {
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

//use csrf
const csrfProtection = csrf();
exports.csrfMiddleWare = (req, res, next) => {
  if (
    req.url.includes("/checkout/process_payment") ||
    req.url.includes("/api")
  ) {
    next();
  } else {
    csrfProtection(req, res, next);
  }
};
//handle csrf errors
exports.handleCsrfErr = (err, req, res, next) => {
  if (err && err.code === "EBADCSRFTOKEN") {
    req.flash("info", "The form has expired! Please try again.");
    res.redirect("back");
  } else {
    next();
  }
};

//check if user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("info", "Please login to access this page.");
    res.redirect("/users/login");
  }
};

// check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_API_ACCESS_TOKEN, (err, user) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};
