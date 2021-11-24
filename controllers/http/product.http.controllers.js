//import form
const {
  tailwindForm,
  createAddProductForm,
  createAddTagsForm,
  createEditProductForm,
  createSearchForm,
} = require("../../forms");
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
  editProductById,
  addImage,
  addCustomTag,
  getAllTagsDetailsByProductId,
  deleteCustomTag,
} = require("../../repositories/product.repositories");
const { consoleLog } = require("../../signale.config");

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
      let formData = {};
      for (let key in form.data) {
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

//main list page
exports.getAllProducts = async (req, res) => {
  const { brands, categories, frequencyResponses, impedanceRanges } =
    await getFormSelectionFields();

  const form = createSearchForm(
    brands,
    categories,
    frequencyResponses,
    impedanceRanges
  );

  form.handle(req, {
    empty: async (form) => {
      const products = await getProducts();
      res.render("products/home", {
        products: products.toJSON(),
        form: form.toHTML(tailwindForm),
        homeUrl: "/products",
      });
    },
    success: async (form) => {
      let formData = {
        ...form.data,
        brand: form.data.brand ? form.data.brand.split(",") : null,
        category: form.data.category ? form.data.category.split(",") : null,
        bluetooth: form.data.bluetooth ? form.data.bluetooth.split(",") : null,
        impedanceRangeId: form.data.impedanceRangeId
          ? form.data.impedanceRangeId.split(",")
          : null,
        frequencyResponseId: form.data.frequencyResponseId
          ? form.data.frequencyResponseId.split(",")
          : null,
      };
      const products = await getProducts(formData);

      res.render("products/home", {
        products: products.toJSON(),
        form: form.toHTML(tailwindForm),
        homeUrl: "/products",
      });
    },
    error: async (form) => {
      const products = await getProducts();
      res.render("products/home", {
        products: products.toJSON(),
        form: form.toHTML(tailwindForm),
        homeUrl: "/products",
      });
    },
  });
};

//home page
exports.getHome = async (req, res) => {
  const { brands, categories, frequencyResponses, impedanceRanges } =
    await getFormSelectionFields();

  const form = createSearchForm(
    brands,
    categories,
    frequencyResponses,
    impedanceRanges
  );

  form.handle(req, {
    empty: async (form) => {
      const products = await getProducts({ userId: req.session.user.id });
      res.render("products/home", {
        products: products.toJSON(),
        form: form.toHTML(tailwindForm),
        homeUrl: "/products/home",
      });
    },
    success: async (form) => {
      let formData = {
        userId: req.session.user.id,
        ...form.data,
        brand: form.data.brand ? form.data.brand.split(",") : null,
        category: form.data.category ? form.data.category.split(",") : null,
        bluetooth: form.data.bluetooth ? form.data.bluetooth.split(",") : null,
        impedanceRangeId: form.data.impedanceRangeId
          ? form.data.impedanceRangeId.split(",")
          : null,
        frequencyResponseId: form.data.frequencyResponseId
          ? form.data.frequencyResponseId.split(",")
          : null,
      };
      const products = await getProducts(formData);

      res.render("products/home", {
        products: products.toJSON(),
        form: form.toHTML(tailwindForm),
        homeUrl: "/products/home",
      });
    },
    error: async (form) => {
      const products = await getProducts({ userId: req.session.user.id });
      res.render("products/home", {
        products: products.toJSON(),
        form: form.toHTML(tailwindForm),
        homeUrl: "/products/home",
      });
    },
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
    product: product,
    combinedUrl: images.map((image) => image.imageUrl).join("<new_image>"),
    combinedThumbnailUrl: images
      .map((image) => image.imageThumbnailUrl)
      .join("<new_image>"),
  });
};

//post add image
exports.postAddImage = async (req, res) => {
  const imageUrl = req.body.imageUrl.split("<new_image>");
  const imageThumbnailUrl = req.body.imageThumbnailUrl.split("<new_image>");
  if (imageUrl.length) {
    await addImage(req.params.id, imageUrl, imageThumbnailUrl);
  }
  req.flash("success", "Image(s) added successfully!");
  res.redirect(`/products/add/tag/${req.params.id}`);
};

//get add tag
exports.getAddTag = async (req, res, next) => {
  const product = (await getProductById(req.params.id)).toJSON();
  const form = createAddTagsForm();
  const tags = await getAllTagsDetailsByProductId(req.params.id);

  res.render("products/addTags", {
    id: req.params.id,
    product: product,
    tags: tags.toJSON(),
    form: form.toHTML(tailwindForm),
  });
};

//post add tag
exports.postAddTag = async (req, res) => {
  const product = (await getProductById(req.params.id)).toJSON();
  const form = createAddTagsForm();
  const tags = await getAllTagsDetailsByProductId(req.params.id);

  form.handle(req, {
    success: async (form) => {
      let formData = {};
      for (let key in form.data) {
        if (form.data[key]) {
          formData[key] = form.data[key];
        }
      }
      const tag = await addCustomTag(req.params.id, formData);

      req.flash("success", "Tag added successfully!");
      res.redirect(`/products/add/tag/${req.params.id}`);
    },
    error: (form) => {
      res.render("products/addTags", {
        id: req.params.id,
        product: product,
        tags: tags.toJSON(),
        form: form.toHTML(tailwindForm),
      });
    },
  });
};

//delete tag
exports.getDeleteTag = async (req, res) => {
  const confirmation = await deleteCustomTag(req.params.tagId);
  if (confirmation) {
    req.flash("success", "Tag deleted successfully!");
    res.redirect(`/products/add/tag/${req.params.productId}`);
  }
};

//get edit product
exports.getEditProduct = async (req, res) => {
  const { brands, categories, frequencyResponses, impedanceRanges } =
    await getFormSelectionFields();
  const form = createEditProductForm(
    brands,
    categories,
    frequencyResponses,
    impedanceRanges
  );
  const product = await getProductById(req.params.id);

  for (field in form.fields) {
    form.fields[field].value = product.get(field);
  }
  res.render("products/edit", {
    form: form.toHTML(tailwindForm),
    product: product,
  });
};

//post edit product
exports.postEditProduct = async (req, res) => {
  const { brands, categories, frequencyResponses, impedanceRanges } =
    await getFormSelectionFields();
  const form = createEditProductForm(
    brands,
    categories,
    frequencyResponses,
    impedanceRanges
  );
  const product = await getProductById(req.params.id);

  form.handle(req, {
    success: async (form) => {
      let formData = {};
      for (let key in form.data) {
        if (form.data[key]) {
          formData[key] = form.data[key];
        }
      }
      formData["userId"] = req.session.user.id;
      const product = await editProductById(req.params.id, formData);

      req.flash("success", "Product edited successfully!");
      res.redirect(`/products/add/image/${req.params.id}`);
    },
    error: (form) => {
      res.render("products/edit", {
        form: form.toHTML(tailwindForm),
        product: product,
      });
    },
  });
};
