const { apiError } = require("../../utils");

const {
  getCategories,
  getBrands,
  getFrequencyResponses,
  getImpedanceRanges,
  addCategory,
  addBrand,
  addFrequencyResponse,
  addImpedanceRange,
} = require("../../repositories/product.repositories");

//category
exports.getAllCategories = async (req, res) => {
  const categories = await getCategories();
  return res.status(200).json({
    status: "success",
    data: categories,
  });
};

exports.addNewCategory = async (req, res) => {
  const { name } = req.body;
  if (name) {
    const category = await addCategory(name);
    return res.status(200).json({
      status: "success",
      data: category,
    });
  }
  throw new apiError("Name is required to add new category!", 400);
};

//brand
exports.getAllBrands = async (req, res) => {
  const brands = await getBrands();
  return res.status(200).json({
    status: "success",
    data: brands,
  });
};

exports.addNewBrand = async (req, res) => {
  const { name, url } = req.body;
  if (name) {
    const brand = await addBrand(name, url);
    return res.status(200).json({
      status: "success",
      data: brand,
    });
  }
  throw new apiError("Name is required to add new brand!", 400);
};

//frequency response
exports.getAllFreqResponses = async (req, res) => {
  const frequencyResponses = await getFrequencyResponses();
  return res.status(200).json({
    status: "success",
    data: frequencyResponses,
  });
};

exports.addNewFreqResponse = async (req, res) => {
  const { name } = req.body;
  if (name) {
    const frequencyResponse = await addFrequencyResponse(name);
    return res.status(200).json({
      status: "success",
      data: frequencyResponse,
    });
  }
  throw new apiError("Name is required to add new frequency response!", 400);
};

//impedance range
exports.getAllImpedanceRanges = async (req, res) => {
  const impedanceRanges = await getImpedanceRanges();
  return res.status(200).json({
    status: "success",
    data: impedanceRanges,
  });
};

exports.addNewImpedanceRange = async (req, res) => {
  const { name } = req.body;
  if (name) {
    const impedanceRange = await addImpedanceRange(name);
    console.log(impedanceRange);
    return res.status(200).json({
      status: "success",
      data: impedanceRange,
    });
  }
  throw new apiError("Name is required to add new impedance range!", 400);
};
