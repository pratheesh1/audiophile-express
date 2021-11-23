const { consoleLog } = require("../signale.config");
const {
  addProductToCart,
  updateCartItem,
  deleteCartItem,
  getCartItems,
} = require("../repositories/cart.repositories");

class CartServices {
  constructor(userId, consoleLog = consoleLog) {
    this.userId = userId;
    this.consoleLog = consoleLog;
  }

  async addProductToCart(
    productId,
    productVariantId = null,
    quantity,
    originalPrice
  ) {
    try {
      const cartItem = await addProductToCart(
        this.userId,
        productId,
        productVariantId,
        quantity,
        originalPrice
      );
      return cartItem;
    } catch (error) {
      this.consoleLog.error(error);
      throw error;
    }
  }

  async updateQuantity(
    productId,
    productVariantId = null,
    quantity,
    originalPrice
  ) {
    try {
      const cartItem = await updateCartItem(
        this.userId,
        productId,
        productVariantId,
        quantity,
        originalPrice
      );
      return cartItem;
    } catch (error) {
      this.consoleLog.error(error);
      throw error;
    }
  }

  async deleteCartItem(productId, productVariantId = null) {
    try {
      const cartItem = await deleteCartItem(
        this.userId,
        productId,
        productVariantId
      );
      return cartItem;
    } catch (error) {
      this.consoleLog.error(error);
      throw error;
    }
  }

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
export default CartServices;
