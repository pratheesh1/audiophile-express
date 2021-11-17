const { consoleLog } = require("../signale.config");
const yup = require("yup");

//import models
const {
  Category,
  Brand,
  FrequencyResponse,
  Product,
  ProductVariant,
  CustomTag,
  ImpedanceRange,
  ProductCustomTag,
} = require("../models");

//category
exports.getCategories = async () => {
  try {
    return await Category.fetchAll();
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

exports.addCategory = async (name) => {
  try {
    await yup
      .string()
      .required(`'${name}' is not a valid name!`)
      .validate(name);
    const category = new Category({ name: name });
    await category.save();
    return category;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

//brand
exports.getBrands = async () => {
  try {
    return await Brand.fetchAll();
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

exports.addBrand = async (brandName, url) => {
  try {
    await yup
      .string()
      .required(`'${brandName}' is not a valid name!`)
      .validate(brandName);
    await yup.string().url(`'${url}' is not a valid url!`).validate(url);
    const brand = new Brand({
      brandName: brandName,
      thumbnail: url ? url : null,
    });
    await brand.save();
    return brand;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

//frequency response
exports.getFrequencyResponses = async () => {
  try {
    return await FrequencyResponse.fetchAll();
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

exports.addFrequencyResponse = async (frequencyResponse) => {
  try {
    await yup
      .string()
      .required(`'${frequencyResponse}' is required!`)
      .validate(frequencyResponse);
    const freqResponse = new FrequencyResponse({
      frequencyResponse: frequencyResponse,
    });
    await freqResponse.save();
    return freqResponse;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

//impedance range
exports.getImpedanceRanges = async () => {
  try {
    return await ImpedanceRange.fetchAll();
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

exports.addImpedanceRange = async (impedanceRange) => {
  try {
    await yup
      .string()
      .required(`'${impedanceRange}' is required!`)
      .validate(impedanceRange);
    const impedanceRange = new ImpedanceRange({
      impedanceValue: impedanceRange,
    });
    await impedanceRange.save();
    return impedanceRange;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
