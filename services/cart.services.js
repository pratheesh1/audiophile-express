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

  /**
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
      if (!product) {
        throw new this.apiError("Product not found", 400);
      }
      let originalPrice = product.get("baseCost");

      //get cost of product variant
      if (productVariantId) {
        const variant = await getProductVariantsById(
          productVariantId,
          productId
        );
        if (!variant) {
          throw new this.apiError("Product variant not found", 400);
        }
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
      this.consoleLog.error(error.message);
      throw error;
    }
  }

  //update cart item
  async updateQuantity(product) {
    try {
      const updatedCart = await this.addToCart(product);

      return updatedCart;
    } catch (error) {
      this.consoleLog.error(error.message);
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
      this.consoleLog.error(error.message);
      throw error;
    }
  }

  //get cart items
  async getCart() {
    try {
      const cartItems = await getCartItems(this.userId);
      return cartItems;
    } catch (error) {
      this.consoleLog.error(error.message);
      throw error;
    }
  }

  //update price to new price for all cart items
  async updateCartPrice() {
    try {
      const cartItems = await getCartItems(this.userId);
      const updatedCartItems = cartItems.map(async (item) => {
        let newPrice = item.get("originalPrice");
        const product = await getProductById(item.get("productId"));
        const productVariant = await getProductVariantsById(
          item.get("productVariantId"),
          item.get("productId")
        );

        if (product) {
          newPrice = product.get("baseCost");
        }
        if (productVariant) {
          newPrice = productVariant.get("variantCost");
        }
        //update price if price has changed
        if (newPrice !== item.get("originalPrice")) {
          await updateCartItem(this.userId, {
            productId: item.get("productId"),
            productVariantId: item.get("productVariantId"),
            quantity: item.get("quantity"),
            originalPrice: newPrice,
          });
        }
      });
    } catch (error) {
      this.consoleLog.error(error.message);
      throw error;
    }
  }

  //check stock and update cart items
  async checkStock() {
    try {
      const cartItems = await getCartItems(this.userId);
      let noStock = cartItems.filter(
        (item) => item.get("quantity") > item.related("product").get("stock")
      );
      //send items with no stock
      if (noStock.length > 0) {
        //update quantity to stock

        noStock.map(async (item) => {
          const currentStock = item.get("productVariantId")
            ? item.related("productVariant").get("stock")
            : item.related("product").get("stock");
          if (currentStock > 0) {
            await this.updateQuantity({
              productId: item.get("productId"),
              productVariantId: item.get("productVariantId")
                ? item.get("productVariantId")
                : null,
              quantity: currentStock,
            });
          } else {
            await this.deleteCartItem({
              productId: item.get("productId"),
              productVariantId: item.get("productVariantId")
                ? item.get("productVariantId")
                : null,
            });
          }
        });
      }
      return noStock;
    } catch (error) {
      this.consoleLog.error(error.message);
      throw error;
    }
  }
}

//export class
module.exports = CartServices;
