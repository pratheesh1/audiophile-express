//import form
const { tailwindForm, createAddProductForm } = require("../../forms");
//import dal
const {
  getBrands,
  getCategories,
  getFrequencyResponses,
  getImpedanceRanges,
  addProduct,
  getProducts,
  deleteProductById,
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
    //pass in cloudinary config to form
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_PRESET,
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
      formData["userId"] = req.session.user.id;
      await addProduct(formData);
      req.flash("success", "New product listing added successfully.");
      res.redirect("/products/home");
    },
    error: (form) => {
      res.render("products/add", {
        form: form.toHTML(tailwindForm),
      });
    },
  });
};

//delete product
exports.getDeleteProduct = async (req, res) => {
  const confirmation = await deleteProductById(req.params.id);
  if (confirmation) {
    req.flash("success", "Product deleted successfully!");
    res.redirect("/products/home");
  }
};

//home page
exports.getHome = async (req, res) => {
  const products = await getProducts();
  res.render("products/home", {
    products: products.toJSON(),
  });
};
