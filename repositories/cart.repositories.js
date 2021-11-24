const { consoleLog } = require("../signale.config");
const yup = require("yup");

const { Cart, CartItem } = require("../models");

/*
 * @desc create cart
 * @param {number} userId
 * @returns {object} cart - bookshelf cart object
 */
exports.createCart = async (userId) => {
  try {
    await yup.number().required().validate(userId);

    const cart = new Cart({
      userId: userId,
    });
    await cart.save();

    return cart;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/*
 * @desc get cart
 * @param {number} userId
 * @returns {object} cart - bookshelf cart object
 */
exports.getCart = async (userId) => {
  try {
    await yup.number().required().validate(userId);

    const cart = await Cart.where({ userId: userId }).fetch();

    return cart;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

//cart schema
const cartSchema = yup.object().shape({
  productId: yup.number().required(),
  productVariantId: yup.number().nullable(),
  quantity: yup.number().required(),
  originalPrice: yup.number().required(),
});
/*
 * @desc add item to cart
 * @param {Object} cartItem - cart item object
 * @param {number} userId - user id
 * @param {number} cartItem.productId - product id
 * @param {number} [cartItem.productVariantId = null] - product variant id
 * @param {number} cartItem.quantity - quantity
 * @param {number} cartItem.originalPrice - price at the time of adding to cart
 *
 * @returns {object} cart - bookshelf cart object
 */
exports.addProductToCart = async (userId, newProduct) => {
  try {
    //validate params
    await yup.number().required().validate(userId);
    await cartSchema.validate(newProduct);

    const cart = await this.getCart(userId);
    const cartItem = new CartItem({
      cartId: cart.get("id"),
      productId: newProduct.productId,
      productVariantId: newProduct.productVariantId
        ? newProduct.productVariantId
        : null,
      quantity: newProduct.quantity,
      originalPrice: newProduct.originalPrice,
    });
    await cartItem.save();

    return cartItem;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/*
 * @desc update cart item
 * @param {number} userId - user id
 * @param {number} productId - product id
 * @param {number} [productVariantId = null] - optional
 * @param {number} quantity - quantity
 * @param {number} originalPrice - price at the time of adding to cart
 * @returns {object} cart - bookshelf cart object
 */
exports.updateCartItem = async (userId, product) => {
  try {
    //validate params
    await cartSchema.validate(product);

    const cart = await this.getCart(userId);
    const cartItem = await CartItem.where({
      cartId: cart.get("id"),
      productId: product.productId,
      productVariantId: product.productVariantId,
    }).fetch({ require: false });
    cartItem.set("quantity", product.quantity);
    cartItem.set("originalPrice", product.originalPrice);
    await cartItem.save();

    return cartItem;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/*
 * @desc delete cart item
 * @param {number} userId - user id
 * @param {number} productId - product id
 * @param {number} [productVariantId = null] - optional
 * @returns {object} cart - bookshelf cart object
 */
exports.deleteCartItem = async (userId, productId, productVariantId = null) => {
  try {
    //validate params
    await yup.number().required().validate(userId);
    await yup.number().required().validate(productId);
    await yup.number().nullable().validate(productVariantId);

    const cart = await this.getCart(userId);
    const cartItem = await CartItem.where({
      cartId: cart.get("id"),
      productId: productId,
      productVariantId: productVariantId,
    }).fetch();
    await cartItem.destroy();

    return true;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};

/*
 * @desc get cart items for a user
 * @param {number} userId - user id
 * @returns {object} cart - bookshelf cart object
 */
exports.getCartItems = async (userId) => {
  try {
    await yup.number().required().validate(userId);

    const cart = await this.getCart(userId);
    const cartItems = await CartItem.where({ cartId: cart.get("id") }).fetchAll(
      {
        withRelated: [
          "product",
          "productVariant",
          "product.image",
          "productVariant.image",
        ],
        require: false,
      }
    );

    return cartItems;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
