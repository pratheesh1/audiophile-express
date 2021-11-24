const { apiError } = require("../../utils");

const CartServices = require("../../services/cart.services");

//get all cart items
exports.getCart = async (req, res, next) => {
  try {
    const cart = new CartServices(req.user.id);
    const cartItems = await cart.getCart();
    res.status(200).json(cartItems.toJSON());
  } catch (error) {
    console.log(error);
    throw new apiError(error.message, 400);
  }
};

//add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const cart = new CartServices(req.user.id);
    const cartItems = await cart.addToCart(req.body);
    res.status(200).json(cartItems.toJSON());
  } catch (error) {
    console.log(error);
    throw new apiError(error.message, 400);
  }
};

//update cart quantity
exports.updateCartQuantity = async (req, res, next) => {
  try {
    const cart = new CartServices(req.user.id);
    const cartItems = await cart.updateQuantity(req.body);
    res.status(200).json(cartItems.toJSON());
  } catch (error) {
    console.log(error);
    throw new apiError(error.message, 400);
  }
};

//remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = new CartServices(req.user.id);
    const status = await cart.deleteCartItem(req.body);
    res.status(200).json(status);
  } catch (error) {
    console.log(error);
    throw new apiError(error.message, 400);
  }
};
