//import form
const { tailwindForm, createRegistrationForm } = require("../../forms");
//import dal
const { getUser, addUser } = require("../../repositories/user.repositories");
const { sendConfirmationEmail } = require("../../utils/nodemailer.config");

//get login form
exports.getLoginForm = (req, res) => {
  res.render("users/login");
};

//post login form
exports.postLoginForm = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUser(email, password);
    if (user) {
      req.session.user = user;
      req.flash("success", `Login successful! Welcome back ${user.firstName}.`);
      res.redirect(req.session.urlToGoBack || "/users/profile");
    } else {
      req.flash("error", "Invalid email or password! Please try again!");
      res.redirect("/users/login");
    }
  } catch (error) {
    req.flash("error", "Invalid email or password! Please try again!");
    res.redirect("/users/login");
  }
};

//get signup form
exports.getSignupForm = (req, res) => {
  const registrationForm = createRegistrationForm();
  res.render("users/signup", {
    form: registrationForm.toHTML(tailwindForm),
  });
};

//post signup form
exports.postSignupForm = (req, res) => {
  const registrationForm = createRegistrationForm();
  registrationForm.handle(req, {
    success: async (form) => {
      const { confirmPassword, ...user } = form.data;
      const userData = { ...user, userTypeId: 1 };
      const newUser = await addUser(userData);
      if (!newUser) {
        res.locals.info.push(
          "An account associated with this email already exist! Please use another email or login to continue!"
        );
        res.render("users/signup", {
          form: form.toHTML(tailwindForm),
        });
      } else {
        sendConfirmationEmail(
          newUser.user.get("firstName"),
          newUser.user.get("email"),
          newUser.token
        );
        res.redirect(req.session.urlToGoBack || "/users/profile");
      }
    },
    error: (form) => {
      res.render("users/signup", {
        form: form.toHTML(tailwindForm),
      });
    },
  });
};

//get logout
exports.getLogout = (req, res) => {
  req.session.user = null;
  req.flash("success", "You have successfully logged out!");
  res.redirect("/");
};
