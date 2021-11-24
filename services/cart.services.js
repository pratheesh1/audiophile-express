const { consoleLog } = require("../signale.config");
const {
  addProductToCart,
  updateCartItem,
  deleteCartItem,
  getCartItems,
} = require("../repositories/cart.repositories");
const {
  getProductById,
  getProductVariantsById,
} = require("../repositories/product.repositories");
const { apiError } = require("../utils");

class CartServices {
  constructor(userId) {
    this.userId = userId;
    this.consoleLog = consoleLog;
    this.apiError = apiError;
  }

  /*
   * @desc add product to cart
   *
   * @param {Object} product
   * @param {number} product.productId
   * @param {number} product.productVariantId
   * @param {number} product.quantity
   *
   * @returns {Object} cartItem
   * @returns {number} cartItem.id
   * @returns {number} cartItem.cartId
   * @returns {number} cartItem.productId
   * @returns {number} cartItem.productVariantId
   * @returns {number} cartItem.quantity
   * @returns {number} cartItem.originalPrice
   */
  async addToCart(newProduct) {
    try {
      const { productId, productVariantId, quantity } = newProduct;

      //get cost of product
      const product = await getProductById(productId);
      var originalPrice = product.get("baseCost");

      //get cost of product variant
      if (productVariantId) {
        const variant = await getProductVariantsById(productVariantId);
        originalPrice = variant.get("variantCost");
      }

      //add to cart
      const cartItems = await this.getCart();
      const currentCartProduct = cartItems.find((item) => {
        if (
          item.get("productId") === productId &&
          item.get("productVariantId") == productVariantId
        ) {
          return item;
        }
      });

      //if product already in cart, update quantity
      if (currentCartProduct) {
        const updatedCartItem = await updateCartItem(this.userId, {
          productId: productId,
          productVariantId: productVariantId ? productVariantId : null,
          quantity: quantity
            ? quantity
            : currentCartProduct.get("quantity") + 1,
          originalPrice: originalPrice,
        });
        return updatedCartItem;
      } else {
        //if product not in cart, add to cart
        const cartItem = await addProductToCart(this.userId, {
          productId: productId,
          productVariantId: productVariantId ? productVariantId : null,
          quantity: quantity ? quantity : 1,
          originalPrice: originalPrice,
        });

        return cartItem;
      }
    } catch (error) {
      this.consoleLog.error(error);
      throw error;
    }
  }

  //update cart item
  async updateQuantity(product) {
    try {
      const updatedCart = await this.addToCart(product);

      return updatedCart;
    } catch (error) {
      this.consoleLog.error(error);
      throw error;
    }
  }

  //delete cart item
  async deleteCartItem(product) {
    try {
      const cartItem = await this.getCart(this.userId);
      const currentCartProduct = cartItem.find((item) => {
        if (
          item.get("productId") === product.productId &&
          item.get("productVariantId") == product.productVariantId
        ) {
          return item;
        }
      });

      if (currentCartProduct) {
        await deleteCartItem(
          this.userId,
          product.productId,
          product.productVariantId ? product.productVariantId : null
        );
        return { success: "CartItem deleted" };
      } else {
        throw new apiError("CartItem not found", 400);
      }
    } catch (error) {
      this.consoleLog.error(error);
      throw error;
    }
  }

  //get cart items
  async getCart() {
    try {
      const cartItems = await getCartItems(this.userId);
      return cartItems;
    } catch (error) {
      this.consoleLog.error(error);
      throw error;
    }
  }
}

//export class
module.exports = CartServices;
