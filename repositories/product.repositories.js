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
  imageUrl: yup.string().url("Product image url is not valid"),
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

// product query schema
const productQuerySchema = yup.object().shape({
  userId: yup.string().test("check", "Stock min must be a number", (value) => {
    if (![null, undefined, "", NaN].includes(value)) {
      yup.number().min(0).validate(value);
    }
    return true;
  }),
  name: yup.string(),
  brand: yup.array().of(yup.number()).nullable(),
  category: yup.array().of(yup.number()).nullable(),
  cost_min: yup
    .string()
    .test("check", "Stock min must be a number", (value) => {
      if (![null, undefined, "", NaN].includes(value)) {
        yup.number().min(0).validate(value);
      }
      return true;
    }),
  cost_max: yup
    .string()
    .test("check", "Stock min must be a number", (value) => {
      if (![null, undefined, "", NaN].includes(value)) {
        yup.number().min(0).validate(value);
      }
      return true;
    }),
  stock_min: yup
    .string()
    .test("check", "Stock min must be a number", (value) => {
      if (![null, undefined, "", NaN].includes(value)) {
        yup.number().min(0).validate(value);
      }
      return true;
    }),
  sku: yup.string(),
  bluetooth: yup.array().of(yup.number()).nullable(),
  impedanceRangeId: yup.array().of(yup.number()).nullable(),
  frequencyResponseId: yup.array().of(yup.number()).nullable(),
});

exports.getProducts = async (query) => {
  try {
    await productQuerySchema.validate(query);

    const products = Product.query(function (queryBuilder) {
      if (query?.userId) {
        queryBuilder.where("userId", query.userId);
      }
      if (query?.name) {
        queryBuilder.where("name", "like", `%${query.name}%`);
      }
      if (query?.brand) {
        queryBuilder.whereIn("brandId", query.brand);
      }
      if (query?.category) {
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
      if (query?.bluetooth) {
        queryBuilder.whereIn("bluetooth", query.bluetooth);
      }
      if (query?.impedanceRangeId) {
        queryBuilder.whereIn("impedanceRangeId", query.impedanceRangeId);
      }
      if (query?.frequencyResponseId) {
        queryBuilder.whereIn("frequencyResponseId", query.frequencyResponseId);
      }
    }).fetchAll({
      withRelated: [
        "brand",
        "category",
        "frequencyResponse",
        "impedanceRange",
        "productVariant",
        "customTag",
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

exports.getProductById = async (id) => {
  try {
    const product = await Product.where({ id: id }).fetch({
      withRelated: [
        "brand",
        "category",
        "frequencyResponse",
        "impedanceRange",
        "productVariant",
        "customTag",
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

exports.deleteProductById = async (id) => {
  try {
    const product = await this.getProductById(id);
    await product.destroy();
    return true;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

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

exports.editProductById = async (id, productData) => {
  try {
    await productSchema.validate(productData);
    const product = await this.getProductById(id);
    await product.save(productData, { method: "update" });
    return product;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

//custom tags
const customTagSchema = yup.object().shape({
  tagName: yup.string().required("Tag name is required"),
  tagValue: yup.string().required("Tag value is required"),
  tagDescription: yup.string(),
});

exports.getCustomTagsById = async (id) => {
  try {
    const customTag = await CustomTag.where({ id: id }).fetch({
      require: false,
    });
    return customTag;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

exports.getCustomTagsByProductId = async (productId) => {
  try {
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

exports.getAllTagsDetailsByProductId = async (id) => {
  try {
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

exports.deleteCustomTag = async (tagId) => {
  try {
    const customTag = await this.getCustomTagsById(tagId);
    console.log(customTag);
    await customTag.destroy();
    return true;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
