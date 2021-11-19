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
exports.getCategories = async (form = false) => {
  try {
    const categories = await Category.collection().orderBy("name").fetch();
    if (form) {
      return categories.map((category) => [
        category.get("id"),
        category.get("name"),
      ]);
    }
    return categories;
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
exports.getBrands = async (form = false) => {
  try {
    const brands = await Brand.collection().orderBy("brandName").fetch();
    if (form) {
      return brands.map((brand) => [brand.get("id"), brand.get("brandName")]);
    }
    return brands;
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
exports.getFrequencyResponses = async (form = false) => {
  try {
    const frequencyResponses = await FrequencyResponse.collection()
      .orderBy("frequencyResponse")
      .fetch();
    if (form) {
      return frequencyResponses.map((frequencyResponse) => [
        frequencyResponse.get("id"),
        frequencyResponse.get("frequencyResponse"),
      ]);
    }
    return frequencyResponses;
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
exports.getImpedanceRanges = async (form = true) => {
  try {
    const impedanceRanges = await ImpedanceRange.collection()
      .orderBy("impedanceValue")
      .fetch();
    if (form) {
      return impedanceRanges.map((impedanceRange) => [
        impedanceRange.get("id"),
        impedanceRange.get("impedanceValue"),
      ]);
    }
    return impedanceRanges;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

exports.addImpedanceRange = async (value) => {
  try {
    await yup
      .number("Impedance value must be a number")
      .required(`'${value}' is required!`)
      .validate(value);
    const impedanceRange = new ImpedanceRange({
      impedanceValue: value,
    });
    await impedanceRange.save();
    return impedanceRange;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

//product
const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Product description is required"),
  baseCost: yup.number().required("Product base cost is required"),
  brandId: yup.number(),
  categoryId: yup.number().required("Product category is required"),
  imagUrl: yup.string().url("Product image url is not valid"),
  imageThumbnailUrl: yup.string().url("Product image thumbnail is not valid"),
  stock: yup.number().required("Product stock is required"),
  userId: yup.number().required("Product user is required"),
  sku: yup.string("Product sku is not valid"),
  frequencyResponseId: yup.number("Frequency response is not valid"),
  bluetooth: yup.number("Product bluetooth is not valid"),
  impedanceRangeId: yup.number("Product impedance range is not valid"),
});

exports.addProduct = async (newProduct) => {
  try {
    await productSchema.validate(newProduct);
    const product = new Product(newProduct);
    await product.save();
    return product;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
