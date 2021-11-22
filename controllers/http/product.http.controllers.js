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
  getProductById,
  deleteProductById,
  addImage,
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
      const product = await addProduct(formData);
      req.flash("success", "New product listing added successfully.");
      res.redirect(`/products/add/image/${product.get("id")}`);
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

//get add image
exports.getAddImage = async (req, res) => {
  const product = (await getProductById(req.params.id)).toJSON();
  const images = product.image;

  res.render("products/addImage", {
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_PRESET,
    id: req.params.id,
    images: images,
    combinedUrl: images.map((image) => image.imageUrl).join("<new_image>"),
    combinedThumbnailUrl: images
      .map((image) => image.thumbnailUrl)
      .join("<new_image>"),
  });
};

//post add image
exports.postAddImage = async (req, res) => {
  const imageUrl = req.body.imageUrl.split("<new_image>");
  const imageThumbnailUrl = req.body.imageThumbnailUrl.split("<new_image>");
  console.log(imageUrl);
  if (imageUrl.length) {
    await addImage(req.params.id, imageUrl, imageThumbnailUrl);
  }
  req.flash("success", "Image(s) added successfully!");
  res.redirect(`/products/add/tag/${req.params.id}`);
};

//get add tag
exports.getAddTag = async (req, res) => {
  const product = (await getProductById(req.params.id)).toJSON();
  const tags = product.tag;
  console.log(tags);
  res.render("products/addTags", {
    id: req.params.id,
    tags: tags,
  });
};
