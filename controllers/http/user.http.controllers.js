//import form
const { tailwindForm, createRegistrationForm } = require("../../forms");
//import dal
const { addUser } = require("../../repositories/user.repositories");

//get login form
exports.getLoginForm = (req, res) => {
  res.render("users/login");
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
      await addUser(userData);
      res.redirect(req.session.urlToGoBack || "/users/profile");
    },
    error: (form) => {
      res.render("users/signup", {
        form: form.toHTML(tailwindForm),
      });
    },
  });
};
