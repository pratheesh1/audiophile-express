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
  Image,
} = require("../models");

/************************** Category ************************************/
/**
 * @desc get all categories
 * @param {boolean} [form = false]
 *
 * @returns {array} - array of categories if form is true
 * @returns {Object} - bookshelf category object if form is false
 */
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

/**
 * @desc add a new category
 * @param {string} name - name of the new category
 * @returns {Object} - bookshelf category object
 */
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

/************************** Brand ************************************/
/**
 * @desc get all brands
 * @param {boolean} [form = false] - if true returns an array of arrays
 *
 * @returns {array} - array of brands if form is true
 * @returns {Object} - bookshelf brand object if form is false
 */
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

/**
 * @desc add a new brand
 * @param {string} brandName - name of the new brand
 * @param {string} url - url of the new brand image
 *
 * @returns {Object} - bookshelf brand object
 */
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

/************************** Frequency Response ************************************/
/**
 * @desc get all frequency responses
 * @param {boolean} [form = false] - if true returns an array of arrays
 *
 * @returns {array} - array of frequency responses if form is true
 * @returns {Object} - bookshelf frequency response object if form is false
 */
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

/**
 * @desc add a new frequency response
 * @param {string} frequencyResponse - new frequency response
 * @returns {Object} - bookshelf frequency response object
 */
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

/************************** Impedance Range ************************************/
/**
 * @desc get all impedance ranges
 * @param {boolean} [form = false] - if true returns an array of arrays
 *
 * @returns {array} - array of impedance ranges if form is true
 * @returns {Object} - bookshelf impedance range object if form is false
 */
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

/**
 * @desc add a new impedance range
 * @param {string} value - new impedance range value
 * @returns {Object} - bookshelf impedance range object
 */
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

/************************** Product, Image ************************************/
//product schema
const productSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  description: yup.string().required("Product description is required"),
  baseCost: yup.number().required("Product base cost is required"),
  brandId: yup.number(),
  categoryId: yup.number().required("Product category is required"),
  imageUrl: yup.string().url("Product image url is not valid"),
  imageThumbnailUrl: yup.string().url("Product image thumbnail is not valid"),
  stock: yup.number().required("Product stock is required"),
  userId: yup.number().required("Product user is required"),
  sku: yup.string("Product sku is not valid"),
  frequencyResponseId: yup.number("Frequency response is not valid"),
  bluetooth: yup.number("Product bluetooth is not valid"),
  impedanceRangeId: yup.number("Product impedance range is not valid"),
});

/**
 * @desc add a new product
 *
 * @param {object} newProduct - new product
 * @param {string} newProduct.name - name of the new product
 * @param {string} newProduct.description - description of the new product
 * @param {number} newProduct.baseCost - base cost of the new product
 * @param {number} [newProduct.brandId] - id of the brand of the new product
 * @param {number} newProduct.categoryId - id of the category of the new product
 * @param {string} [newProduct.imageUrl] - url of the image of the new product
 * @param {string} [newProduct.imageThumbnailUrl] - url of the thumbnail of the new product
 * @param {number} newProduct.stock - stock of the new product
 * @param {number} newProduct.userId - id of the user of the new product
 * @param {string} [newProduct.sku] - sku of the new product
 * @param {number} [newProduct.frequencyResponseId] - id of the frequency response of the new product
 * @param {number} [newProduct.bluetooth] - bluetooth of the new product
 * @param {number} [newProduct.impedanceRangeId] - id of the impedance range of the new product
 *
 * @returns {Object} - bookshelf product object
 */
exports.addProduct = async (newProduct) => {
  try {
    await productSchema.validate(newProduct);

    const { imageThumbnailUrl, imageUrl, ...productData } = newProduct;
    const product = new Product(productData);
    await product.save();

    if (imageUrl) {
      const image = new Image({
        productId: product.get("id"),
        imageUrl: imageUrl,
        imageThumbnailUrl: imageThumbnailUrl,
      });
      await image.save();
    }

    return product;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

// helper for yup transform function
// code from https://github.com/jquense/yup/issues/298#issuecomment-543791550
function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === "string" && originalValue === "") {
    return null;
  }
  return value;
}

// product query schema
const productQuerySchema = yup.object().shape({
  userId: yup.number().integer().nullable().transform(emptyStringToNull),
  name: yup.string(),
  description: yup.string(),
  brand: yup.array().of(yup.number()).nullable(),
  category: yup.array().of(yup.number()).nullable(),
  cost_min: yup.number().integer().nullable().transform(emptyStringToNull),
  cost_max: yup.number().integer().nullable().transform(emptyStringToNull),
  stock_min: yup.number().integer().nullable().transform(emptyStringToNull),
  sku: yup.string(),
  bluetooth: yup.array().of(yup.number()).nullable(),
  impedanceRangeId: yup.array().of(yup.number()).nullable(),
  frequencyResponseId: yup.array().of(yup.number()).nullable(),
});

const productVariantSchema = yup.object().shape({
  productId: yup.number().integer(),
  variantName: yup.string(),
  variantDescription: yup.string(),
  variantCost: yup.number().integer(),
  stock: yup.number().integer(),
});

/**
 * @desc get products by query
 *
 * @param {object} query - query to filter products
 * @param {string} [query.userId] - id of the user of the new product
 * @param {string} [query.name] - name of the new product
 * @param {string} [query.description] - description of the new product
 * @param {string} [query.brand] - id of the brand of the new product
 * @param {string} [query.category] - id of the category of the new product
 * @param {string} [query.cost_min] - cost min of the new product
 * @param {string} [query.cost_max] - cost max of the new product
 * @param {string} [query.stock_min] - stock min of the new product
 * @param {string} [query.sku] - sku of the new product
 * @param {string} [query.bluetooth] - bluetooth of the new product
 * @param {string} [query.impedanceRangeId] - id of the impedance range of the new product
 * @param {string} [query.frequencyResponseId] - id of the frequency response of the new product
 * @params {string} [query.sort] - sort by field
 *
 * @returns {Object} - bookshelf product object
 */
exports.getProducts = async (query) => {
  try {
    await productQuerySchema.validate(query);

    const products = Product.query(function (queryBuilder) {
      if (query?.userId) {
        queryBuilder.where("userId", query.userId);
      }
      if (query?.name) {
        queryBuilder.orWhereRaw(
          "LOWER(name) like ?",
          `%${query.name.toLowerCase()}%`
        );

        console.log(queryBuilder.toString());
      }
      if (query?.description) {
        queryBuilder.orWhereRaw(
          "LOWER(description) like ?",
          `%${query.description.toLowerCase()}%`
        );
      }
      if (query?.brand?.length) {
        queryBuilder.whereIn("brandId", query.brand);
      }
      if (query?.category?.length) {
        queryBuilder.whereIn("categoryId", query.category);
      }
      if (query?.cost_min) {
        queryBuilder.where("baseCost", ">=", query.cost_min);
      }
      if (query?.cost_max) {
        queryBuilder.where("baseCost", "<=", query.cost_max);
      }
      if (query?.stock_min) {
        queryBuilder.where("stock", ">=", query.stock_min);
      }
      if (query?.sku) {
        queryBuilder.where("sku", "like", `%${query.sku}%`);
      }
      if (query?.bluetooth?.length) {
        queryBuilder.whereIn("bluetooth", query.bluetooth);
      }
      if (query?.impedanceRangeId?.length) {
        queryBuilder.whereIn("impedanceRangeId", query.impedanceRangeId);
      }
      if (query?.frequencyResponseId?.length) {
        queryBuilder.whereIn("frequencyResponseId", query.frequencyResponseId);
      }
      if (query?.sort) {
        queryBuilder.orderBy(query.sort);
      }
    }).fetchAll({
      withRelated: [
        "brand",
        "category",
        "frequencyResponse",
        "impedanceRange",
        "productVariant",
        "productVariant.image",
        "customTag",
        "customTag.customTag",
        "image",
      ],
      require: false,
    });

    return products;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc get product by id
 * @param {number} id - id of the product
 * @returns {Object} - bookshelf product object
 */
exports.getProductById = async (id) => {
  try {
    const product = await Product.where({ id: id }).fetch({
      withRelated: [
        "brand",
        "category",
        "frequencyResponse",
        "impedanceRange",
        "productVariant",
        "productVariant.image",
        "customTag",
        "customTag.customTag",
        "image",
      ],
      require: false,
    });

    return product;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc get product variants by product id
 * @param {number} id - id of the product variant
 * @param {number} productId - id of the product
 * @returns {Object} - bookshelf product variant object
 */
exports.getProductVariantsById = async (id, productId) => {
  try {
    await yup.number().integer().positive().nullable().validate(id);
    await yup.number().integer().positive().nullable().validate(productId);

    const productVariants = await ProductVariant.where({
      id: id,
      productId: productId,
    }).fetch({
      withRelated: [
        "product",
        "product.brand",
        "product.category",
        "product.frequencyResponse",
        "product.impedanceRange",
        "product.customTag",
        "product.image",
        "image",
      ],
      require: false,
    });

    return productVariants;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc delete product by id
 * @param {number} id - id of the product
 * @param {number} userId - id of the user
 * @returns {Boolean} - true if product is deleted
 */
exports.deleteProductById = async (id, userId) => {
  try {
    await yup.number().integer().validate(id);
    await yup.number().integer().validate(id);

    const product = await this.getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    } else if (product.get("userId") == userId) {
      await product.destroy();
    } else {
      throw new Error("You are not authorized to delete this product");
    }

    return true;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc add new product image
 *
 * @param {number} productId - id of the product
 * @param {string} imageUrl - url of the image
 * @param {string} imageThumbnailUrl - url of the thumbnail
 *
 * @return {Boolean} - true if image is added
 */
exports.addImage = async (productId, imageUrl, imageThumbnailUrl) => {
  try {
    await yup
      .array()
      .of(yup.string().url())
      .required()
      .validate(imageUrl, imageThumbnailUrl);

    await Image.where({ productId: productId }).destroy({
      require: false,
    });
    for (let i = 0; i < imageUrl.length; i++) {
      const image = new Image({
        productId: productId,
        imageUrl: imageUrl[i],
        imageThumbnailUrl: imageThumbnailUrl[i],
      });
      await image.save();
    }

    return true;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc edit product
 * @param {number} id - id of the product
 * @param {object} productData - data of the product as defined in the schema
 * @returns {Object} - bookshelf product object
 */
exports.editProductById = async (id, productData) => {
  try {
    await yup.number().integer().validate(id);
    await productQuerySchema.validate(productData);

    const product = await this.getProductById(id);
    await product.save(productData, { method: "update" });

    return product;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc edit productVariant
 * @param {number} id - id of the product variant
 * @param {object} productVariantData - data of the product variant as defined in the schema
 * @returns {Object} - bookshelf product variant object
 */
exports.editProductVariantById = async (id, productVariantData) => {
  try {
    await yup.number().integer().validate(id);
    await productVariantSchema.validate(productVariantData);

    const productVariant = await ProductVariant.where({ id: id }).fetch({
      require: false,
    });
    await productVariant.save(productVariantData, { method: "update" });

    return productVariant;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

//custom tags schema
const customTagSchema = yup.object().shape({
  tagName: yup.string().required("Tag name is required"),
  tagValue: yup.string().required("Tag value is required"),
  tagDescription: yup.string(),
});

/************************** Custom Tag ************************************/
/**
 * @desc get custom tag by id
 * @param {number} id - id of the tag
 * @returns {Object} - bookshelf tag object
 */
exports.getCustomTagsById = async (id) => {
  try {
    await yup.number().integer().validate(id);

    const customTag = await CustomTag.where({ id: id }).fetch({
      require: false,
    });

    return customTag;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc get custom tags by product id
 * @param {number} productId - id of the product
 * @returns {Object} - bookshelf tag object
 */
exports.getCustomTagsByProductId = async (productId) => {
  try {
    await yup.number().integer().validate(productId);

    const customTags = await ProductCustomTag.collection()
      .where({
        productId: productId,
      })
      .fetch({
        require: false,
      });

    return customTags;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc get full tag details by product id
 * @param {number} id - id of the product
 * @returns {Object} - bookshelf tag object
 */
exports.getAllTagsDetailsByProductId = async (id) => {
  try {
    await yup.number().integer().validate(id);

    const customTags = (await this.getCustomTagsByProductId(id)).pluck(
      "customTagId"
    );
    const tags = await CustomTag.query(function (queryBuilder) {
      queryBuilder.whereIn("id", customTags);
    }).fetchAll({
      require: false,
    });

    return tags;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc add new custom tag
 * @param {number} productId - id of the product
 * @param {Object} tag - data of the custom tag as defined in the schema
 * @returns {Object} - bookshelf tag object
 */
exports.addCustomTag = async (productId, tag) => {
  try {
    await customTagSchema.validate(tag);

    const customTag = new CustomTag(tag);
    await customTag.save();

    const newCustomTag = new ProductCustomTag({
      productId: productId,
      customTagId: customTag.get("id"),
    });
    await newCustomTag.save();

    return customTag;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/**
 * @desc delete custom tag by id
 * @param {number} tagId - id of the tag
 * @returns {Boolean} - true if tag is deleted
 */
exports.deleteCustomTag = async (tagId) => {
  try {
    await yup.number().integer().validate(tagId);

    const customTag = await this.getCustomTagsById(tagId);
    await customTag.destroy();

    return true;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
