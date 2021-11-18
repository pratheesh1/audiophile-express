//import forms
const forms = require("forms");
//shortcut for forms.fields and forms.validators
const fields = forms.fields;
var validators = forms.validators;
var widgets = require("forms").widgets;

//function to add tailwind classes to form
var tailwindForm = function (name, object) {
  if (
    Array.isArray(object.widget.classes)
      ? !object.widget.classes.length > 0
      : true
  ) {
    //   set classes if not already set
    object.widget.classes = [
      "shadow",
      "appearance-none",
      "border",
      "rounded",
      "py-2",
      "px-3",
      "text-gray-700",
      "leading-tight",
      "focus:outline-none",
      "focus:shadow-outline",
    ];
  } else {
    //   add classes if already set
    object.widget.classes.push(
      "shadow",
      "appearance-none",
      "border",
      "rounded",
      "py-2",
      "px-3",
      "text-gray-700",
      "leading-tight",
      "focus:outline-none",
      "focus:shadow-outline"
    );
  }

  //add tailwind classes to form - green border if valid, red if invalid
  var validationClass = object.value && !object.error ? "border-green-400" : "";
  validationClass = object.error ? "border-red-400" : validationClass;
  if (validationClass) {
    object.widget.classes.push(validationClass);
  }

  // error object
  var label = object.labelHTML(name);
  var error = object.error
    ? `<div class="text-red-500 text-sm p-2 font-serif">${object.error}</div>`
    : "";

  //return form widget
  var widget = object.widget.toHTML(name, object);
  return `<div class="align-middle m-3 ${validationClass}"> <div class="my-2">${label}</div> ${widget} ${error} </div>`;
};

//user registration form
const createRegistrationForm = (width = "w-full") => {
  const labelClasses = [
    "text-gray-600 m-2 text-lg font-serif dark:text-gray-200",
  ];
  return forms.create({
    firstName: fields.string({
      label: "First name: ",
      required: true,
      validators: [validators.required("First name is required!")],
      widget: widgets.text({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    lastName: fields.string({
      label: "Last name: ",
      required: true,
      validators: [validators.required("Last name is required!")],
      widget: widgets.text({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    email: fields.string({
      label: "Email: ",
      required: true,
      validators: [
        validators.required("Email is required!"),
        validators.email("Email is invalid!"),
      ],
      widget: widgets.text({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    password: fields.string({
      label: "Password: ",
      required: true,
      validators: [validators.required("Password is required!")],
      widget: widgets.password({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    confirmPassword: fields.string({
      label: "Confirm Password: ",
      required: true,
      validators: [
        validators.required("Confirm Password is required!"),
        validators.matchField("password", "Passwords do not match!"),
      ],
      widget: widgets.password({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
  });
};

module.exports = {
  createRegistrationForm,
  tailwindForm,
};
