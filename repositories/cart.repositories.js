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

/*
 * @desc add product to cart
 * @param {number} userId - user id
 * @param {number} productId - product id
 * @param {number} [productVariantId = null] - optional
 * @param {number} quantity - quantity
 * @param {number} originalPrice - price at the time of adding to cart
 * @returns {object} cart - bookshelf cart object
 */
exports.addProductToCart = async (
  userId,
  productId,
  productVariantId = null,
  quantity,
  originalPrice
) => {
  try {
    //validate params
    await yup.number().required().validate(userId);
    await yup.number().required().validate(productId);
    await yup.number().nullable().validate(productVariantId);
    await yup.number().required().validate(quantity);
    await yup.number().required().validate(originalPrice);

    const cart = await this.getCart(userId);
    const cartItem = new CartItem({
      cartId: cart.get("id"),
      productId: productId,
      productVariantId: productVariantId,
      quantity: quantity,
      originalPrice: originalPrice,
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
exports.updateCartItem = async (
  userId,
  productId,
  productVariantId = null,
  quantity,
  originalPrice
) => {
  try {
    //validate params
    await yup.number().required().validate(userId);
    await yup.number().required().validate(productId);
    await yup.number().nullable().validate(productVariantId);
    await yup.number().required().validate(quantity);
    await yup.number().required().validate(originalPrice);

    const cart = await this.getCart(userId);
    const cartItem = await CartItem.where({
      cartId: cart.get("id"),
      productId: productId,
      productVariantId: productVariantId,
    }).fetch({ require: false });
    cartItem.set("quantity", quantity);
    cartItem.set("originalPrice", originalPrice);
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

    return cartItem;
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
        withRelated: ["product", "productVariant"],
        require: false,
      }
    );

    return cartItems;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
