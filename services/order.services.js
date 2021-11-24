const CartServices = require("cart.services");
const {
  createOrder,
  createOrderItem,
} = require("../repositories/order.repositories");

class OrderServices extends CartServices {
  constructor(userId, addressId, notes) {
    super(userId);
    this.addressId = addressId;
    this.notes = notes;
  }

  async checkOut() {
    const cartItems = await this.getCart();
    const order = await createOrder(
      this.userId,
      this.addressId,
      Date.now(),
      this.notes
    );
    //TODO: check if product is available

    const orderItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const orderItem = await createOrderItem(
          order.id,
          cartItem.productId,
          item.productVariantId ? item.productVariantId : null,
          cartItem.quantity,
          cartItem.originalPrice
        );
        this.deleteCartItem(
          cartItem.id,
          productVariantId ? productVariantId : null
        );

        //TODO: Send email to user
        //TODO: decrease stock
        return orderItem;
      })
    );
    return order;
  }
}

//export class
module.exports = OrderServices;
