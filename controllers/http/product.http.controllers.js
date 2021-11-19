//import form
const { tailwindForm, createAddProductForm } = require("../../forms");
//import dal
const {
  getBrands,
  getCategories,
  getFrequencyResponses,
  getImpedanceRanges,
  addProduct,
} = require("../../repositories/product.repositories");

//get form selection fields
async function getFormSelectionFields() {
  const brands = await getBrands(true);
  brands.unshift(["", "--- Select Brand ---"]);
  const categories = await getCategories(true);
  categories.unshift(["", "--- Select Category ---"]);
  const frequencyResponses = await getFrequencyResponses(true);
  frequencyResponses.unshift(["", "--- Select ---"]);
  const impedanceRanges = await getImpedanceRanges(true);
  impedanceRanges.unshift(["", "--- Select ---"]);
  return { brands, categories, frequencyResponses, impedanceRanges };
}

//get add product form
exports.getAddProduct = async (req, res) => {
  const { brands, categories, frequencyResponses, impedanceRanges } =
    await getFormSelectionFields();
  const form = createAddProductForm(
    brands,
    categories,
    frequencyResponses,
    impedanceRanges
  );
  res.render("products/add", {
    form: form.toHTML(tailwindForm),
  });
};

//post add product form
exports.postAddProduct = async (req, res) => {
  const { brands, categories, frequencyResponses, impedanceRanges } =
    await getFormSelectionFields();
  const form = createAddProductForm(
    brands,
    categories,
    frequencyResponses,
    impedanceRanges
  );
  form.handle(req, {
    success: async (form) => {
      var formData = {};
      for (var key in form.data) {
        if (form.data[key]) {
          formData[key] = form.data[key];
        }
      }
      formData["userId"] = 5;
      await addProduct(formData);
      res.redirect("/products");
    },
    error: (form) => {
      res.render("products/add", {
        form: form.toHTML(tailwindForm),
      });
    },
  });
};

//home page
exports.getHome = async (req, res) => {
  res.render("products/home");
};
