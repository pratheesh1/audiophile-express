//import form
const { tailwindForm, createRegistrationForm } = require("../../forms");
//import dal
const {
  getUser,
  addUser,
  verifyEmail,
} = require("../../repositories/user.repositories");
const { sendConfirmationEmail } = require("../../utils/nodemailer.config");

//get login form
exports.getLoginForm = (req, res) => {
  if (req.session.user) {
    res.redirect("/products/home");
  } else {
    res.render("users/login");
  }
};

//post login form
exports.postLoginForm = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUser(email, password);
    if (user && user.userTypeId === 1) {
      req.session.user = user;
      req.flash("success", `Login successful! Welcome back ${user.firstName}.`);
      res.redirect(req.session.urlToGoBack || "/products/home");
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
  if (req.session.user) {
    res.redirect("/products/home");
  } else {
    const registrationForm = createRegistrationForm();
    res.render("users/signup", {
      form: registrationForm.toHTML(tailwindForm),
    });
  }
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
        req.flash(
          "success",
          "You have successfully registered! You may want to verify your email by clicking the link in the email we sent you."
        );
        res.redirect(req.session.urlToGoBack || "/products/login");
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
  res.locals.user = null;
  req.flash("success", "You have successfully logged out!");
  res.redirect("/users/login");
};

//user email confirmation
exports.getVerifyEmail = async (req, res) => {
  const { token } = req.params;
  const user = await verifyEmail(token);
  //FIXME: flash message not working. Remove this log after fixing
  console.log(user);
  if (user) {
    req.flash("success", "Your email has been verified!");
    res.redirect("/users/login");
  } else {
    req.flash("error", "This link is invalid or has expired!");
    res.redirect("/users/login");
  }
};
