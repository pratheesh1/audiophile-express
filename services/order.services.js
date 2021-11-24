const CartServices = require("../services/cart.services");
const {
  createOrder,
  createOrderItem,
} = require("../repositories/order.repositories");

class OrderServices extends CartServices {
  constructor(userId) {
    super(userId);
  }

  async checkOut(addressId, notes) {
    const cartItems = await this.getCart();
    const order = await createOrder(
      this.userId,
      addressId,
      notes ? notes : null
    );

    await Promise.all(
      cartItems.map((cartItem) => {
        createOrderItem({
          orderId: order.get("id"),
          productId: cartItem.get("productId"),
          productVariantId: cartItem.get("productVariantId")
            ? cartItem.get("productVariantId")
            : null,
          quantity: cartItem.get("quantity"),
          cost: cartItem.get("originalPrice"),
        }).then(() => {
          this.deleteCartItem({
            productId: cartItem.get("productId"),
            productVariantId: cartItem.get("productVariantId")
              ? cartItem.get("productVariantId")
              : null,
          });
        });
      })
    );
    return order;
  }
}

//export class
module.exports = OrderServices;
