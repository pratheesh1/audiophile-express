const { apiError } = require("../../utils");

const {
  getCategories,
  getBrands,
  getFrequencyResponses,
  getImpedanceRanges,
} = require("../../repositories/product.repositories");

//category
exports.getAllCategories = async (req, res) => {
  const categories = await getCategories();
  return res.status(200).json({
    status: "success",
    data: categories,
  });
};

//brand
exports.getAllBrands = async (req, res) => {
  const brands = await getBrands();
  return res.status(200).json({
    status: "success",
    data: brands,
  });
};

//frequency response
exports.getAllFreqResponses = async (req, res) => {
  const frequencyResponses = await getFrequencyResponses();
  return res.status(200).json({
    status: "success",
    data: frequencyResponses,
  });
};

//impedance range
exports.getAllImpedanceRanges = async (req, res) => {
  const impedanceRanges = await getImpedanceRanges();
  return res.status(200).json({
    status: "success",
    data: impedanceRanges,
  });
};
