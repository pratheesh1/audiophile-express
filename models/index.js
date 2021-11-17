const bookshelf = require("../bookshelf");

//model table categories
const Category = bookshelf.model("Category", {
  tableName: "categories",
});

//model table brands
const Brand = bookshelf.model("Brand", {
  tableName: "brands",
});

//model table frequency_responses
const FrequencyResponse = bookshelf.model("FrequencyResponse", {
  tableName: "frequency_responses",
});

//model table product_variants
const ProductVariant = bookshelf.model("ProductVariant", {
  tableName: "product_variants",
  product() {
    return this.belongsTo("Product", "productId");
  },
});

//model table email_validators
const EmailValidator = bookshelf.model("EmailValidator", {
  tableName: "email_validators",
  user() {
    return this.belongsTo("User", "userId");
  },
});

//model table user_types
const UserType = bookshelf.model("UserType", {
  tableName: "user_types",
});

//model table statuses
const Status = bookshelf.model("Status", {
  tableName: "statuses",
});

//model table countries
const Country = bookshelf.model("Country", {
  tableName: "countries",
});

//model table custom_tags
const CustomTag = bookshelf.model("CustomTag", {
  tableName: "custom_tags",
});

//model table addresses
const Address = bookshelf.model("Address", {
  tableName: "addresses",
  country() {
    return this.belongsTo("Country", "countryId");
  },
});

//model table users
const User = bookshelf.model("User", {
  tableName: "users",
  address() {
    return this.hasOne("Address");
  },
  userType() {
    return this.belongsTo("UserType", "userTypeId");
  },
  status() {
    return this.belongsTo("Status", "isVerified");
  },
});

//model table impedance_ranges
const ImpedanceRange = bookshelf.model("ImpedanceRange", {
  tableName: "impedance_ranges",
});

//model table carts
const Cart = bookshelf.model("Cart", {
  tableName: "carts",
  user() {
    return this.belongsTo("User", "userId");
  },
});

//model table cart_items
const CartItem = bookshelf.model("CartItem", {
  tableName: "cart_items",
  cart() {
    return this.belongsTo("Cart", "cartId");
  },
  product() {
    return this.belongsTo("Product", "productId");
  },
  productVariant() {
    return this.belongsTo("ProductVariant", "productVariantId");
  },
});

//model table orders
const Order = bookshelf.model("Order", {
  tableName: "orders",
  status() {
    return this.belongsTo("Status", "statusId");
  },
  address() {
    return this.belongsTo("Address", "addressId");
  },
  user() {
    return this.belongsTo("User", "userId");
  },
});

//model table products
const Product = bookshelf.model("Product", {
  tableName: "products",
  brand() {
    return this.belongsTo("Brand", "brandId");
  },
  category() {
    return this.belongsTo("Category", "categoryId");
  },
  frequencyResponse() {
    return this.belongsTo("FrequencyResponse", "frequencyResponseId");
  },
  impedanceRange() {
    return this.belongsTo("ImpedanceRange", "impedanceRangeId");
  },
});

//model table product_custom_tags
const ProductCustomTag = bookshelf.model("ProductCustomTag", {
  tableName: "product_custom_tags",
  customTag() {
    return this.belongsTo("CustomTag", "customTagId");
  },
  product() {
    return this.belongsTo("Product", "productId");
  },
});

//model table orders_items
const OrderItem = bookshelf.model("OrderItem", {
  tableName: "orders_items",
  order() {
    return this.belongsTo("Order", "orderId");
  },
  product() {
    return this.belongsTo("Product", "productId");
  },
  productVariant() {
    return this.belongsTo("ProductVariant", "productVariantId");
  },
});

module.exports = {
  Category,
  Brand,
  FrequencyResponse,
  ProductVariant,
  EmailValidator,
  UserType,
  Status,
  Country,
  CustomTag,
  Address,
  User,
  ImpedanceRange,
  Cart,
  CartItem,
  Order,
  Product,
  ProductCustomTag,
  OrderItem,
};
