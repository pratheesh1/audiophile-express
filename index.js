const express = require("express");
const morgan = require("morgan");
const path = require("path");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
//handle async/await errors
require("express-async-errors");
//export error handler
const { errorHandler } = require("./middlewares");

// Initialize Express
const app = express();
//use main process custom logger
const { consoleLog } = require("./signale.config");

//use morgan to log requests to the console
app.use(morgan("dev"));
//static folder
app.use(express.static(path.join(__dirname, "/public")));

//set-up view engine
app.set("view engine", "hbs");
//set-up partials, wax-on and set-up views
hbs.registerPartials(path.join(__dirname, "views/partials"));
wax.on(hbs.handlebars);
wax.setLayoutPath(path.join(__dirname, "views/layouts"));

//enable forms
app.use(express.urlencoded({ extended: true }));

(async function () {
  //routes

  //404 page for all other routes
  app.use("/", (req, res) => {
    res.status(404).render("404/404", {
      title: "404",
      message: "Page not found",
    });
  });
})();

//use error handler
app.use(errorHandler);

app.listen(process.env.PORT || 3500, () => {
  consoleLog.success(`Server started on port ${process.env.PORT || 3500}`);
});
