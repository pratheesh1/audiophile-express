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
    if (object.widget.type !== "multipleRadio") {
      object.widget.classes = [
        "shadow",
        "appearance-none",
        "border",
        "rounded",
        "py-2",
        "px-3",
        "text-gray-700",
        "leading-tight",
        "focus:border-2",
        "focus:outline-none",
        "focus:border-blue-300",
        "focus:shadow-sm",
      ];
    }
  } else {
    //   add classes if already set
    if (object.widget.type !== "multipleRadio") {
      object.widget.classes.push(
        "shadow",
        "appearance-none",
        "border",
        "rounded",
        "py-2",
        "px-3",
        "text-gray-700",
        "leading-tight",
        "focus:border-2",
        "focus:outline-none",
        "focus:border-blue-300",
        "focus:shadow-sm"
      );
    }
  }

  //add tailwind classes to form - green border if valid, red if invalid
  var validationClass =
    object.value && !object.error ? "border-3 border-green-400" : "";
  validationClass = object.error ? "border-3 border-red-400" : validationClass;
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

const createAddProductForm = (
  brands,
  categories,
  frequencyResponses,
  impedanceRange,
  width = "w-full"
) => {
  const labelClasses = ["text-gray-600 m-2 text-lg font-serif dark:text-white"];
  return forms.create({
    name: fields.string({
      label: "Product Name:*",
      required: true,
      validators: [validators.required("Product name is required!")],
      widget: widgets.text({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    description: fields.string({
      label: "Description:*",
      required: true,
      validators: [validators.required("Description is required!")],
      widget: widgets.textarea({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    baseCost: fields.string({
      label: "Base Cost:*",
      required: true,
      validators: [
        validators.required("Base cost is required!"),
        validators.integer("Base cost must be a number!"),
      ],
      widget: widgets.text({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    brandId: fields.string({
      label: "Brand:*",
      required: true,
      validators: [validators.required("Brand is required!")],
      widget: widgets.select({ classes: [width] }),
      errorAfterField: true,
      choices: brands,
      cssClasses: {
        label: labelClasses,
      },
    }),
    categoryId: fields.string({
      label: "Category:*",
      required: true,
      validators: [validators.required("Category is required!")],
      widget: widgets.select({ classes: [width] }),
      errorAfterField: true,
      choices: categories,
      cssClasses: {
        label: labelClasses,
      },
    }),
    imageUrl: fields.string({
      widget: widgets.text({ classes: ["hidden"] }),
      errorAfterField: true,
      cssClasses: {
        label: ["hidden"],
      },
    }),
    imageThumbnailUrl: fields.string({
      widget: widgets.text({ classes: ["hidden"] }),
      cssClasses: {
        label: ["hidden"],
      },
    }),
    stock: fields.string({
      label: "Stock:*",
      required: true,
      validators: [
        validators.required("Stock is required!"),
        validators.integer("Stock must be a number!"),
      ],
      widget: widgets.text({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    sku: fields.string({
      label: "SKU:",
      widget: widgets.text({ classes: [width] }),
      errorAfterField: true,
      cssClasses: {
        label: labelClasses,
      },
    }),
    frequencyResponseId: fields.string({
      label: "Frequency Response:",
      widget: widgets.select({ classes: [width] }),
      errorAfterField: true,
      choices: frequencyResponses,
      cssClasses: {
        label: labelClasses,
      },
    }),
    bluetooth: fields.string({
      label: "Bluetooth:",
      widget: widgets.multipleRadio({ classes: ["m-3"] }),
      errorAfterField: true,
      choices: [
        [1, "Yes"],
        [0, "No"],
      ],
      cssClasses: {
        label: labelClasses,
      },
    }),
    impedanceRangeId: fields.string({
      label: "Impedance Range:",
      widget: widgets.select({ classes: [width] }),
      errorAfterField: true,
      choices: impedanceRange,
      cssClasses: {
        label: labelClasses,
      },
    }),
  });
};

module.exports = {
  createRegistrationForm,
  createAddProductForm,
  tailwindForm,
};
