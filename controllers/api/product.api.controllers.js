const { apiError } = require("../../utils");
const { productQuerySchema } = require("../../models/apiModels");
const {
  getCategories,
  getBrands,
  getFrequencyResponses,
  getImpedanceRanges,
  getProducts,
  getProductById,
} = require("../../repositories/product.repositories");

//category
exports.getAllCategories = async (req, res) => {
  const categories = await getCategories();
  return res.status(200).json({
    categories,
  });
};

//brand
exports.getAllBrands = async (req, res) => {
  const brands = await getBrands();
  return res.status(200).json({
    brands,
  });
};

//frequency response
exports.getAllFreqResponses = async (req, res) => {
  const frequencyResponses = await getFrequencyResponses();
  return res.status(200).json({
    frequencyResponses,
  });
};

//impedance range
exports.getAllImpedanceRanges = async (req, res) => {
  const impedanceRanges = await getImpedanceRanges();
  return res.status(200).json({
    impedanceRanges,
  });
};

//get all products
exports.getAllProducts = async (req, res) => {
  try {
    const rawQuery = req.query;
    let query = {};

    //sanitized query
    if (rawQuery?.cost_min) {
      query["cost_min"] = parseInt(rawQuery.cost_min * 100);
    }
    if (rawQuery?.cost_max) {
      query["cost_max"] = parseInt(rawQuery.cost_max * 100);
    }
    if (rawQuery?.category) {
      query["category"] = [rawQuery.category];
    }
    if (rawQuery?.brand?.length && rawQuery?.brand[0]) {
      query["brand"] = rawQuery.brand;
    }
    if (rawQuery?.bluetooth) {
      query["bluetooth"] = [rawQuery.bluetooth];
    }
    if (
      rawQuery?.frequencyResponseId?.length &&
      rawQuery?.frequencyResponseId[0]
    ) {
      query["frequencyResponseId"] = rawQuery.frequencyResponseId;
    }
    if (rawQuery?.impedanceRangeId?.length && rawQuery?.impedanceRangeId[0]) {
      query["impedanceRangeId"] = rawQuery.impedanceRangeId;
    }
    if (rawQuery?.sort) {
      query["sort"] = rawQuery.sort;
    }
    if (rawQuery?.name) {
      query["name"] = rawQuery.name;
    }
    if (rawQuery?.description) {
      query["description"] = rawQuery.description;
    }

    const products = await getProducts(query);
    return res.status(200).json({
      products: products,
    });
  } catch (error) {
    throw new apiError(error.message, 400);
  }
};

//get product by id
exports.getProductById = async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }
  return res.status(200).json({
    product,
  });
};
