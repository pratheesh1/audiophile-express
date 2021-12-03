const CartServices = require("../services/cart.services");
const {
  createOrder,
  createOrderItem,
  getOrders,
  getOrderItems,
  updateOrder,
  updateOrderItemStatus,
} = require("../repositories/order.repositories");
const {
  getProductById,
  getProductVariantsById,
  editProductById,
  editProductVariantById,
} = require("../repositories/product.repositories");

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
        //create order item
        createOrderItem({
          orderId: order.get("id"),
          productId: cartItem.get("productId"),
          productVariantId: cartItem.get("productVariantId")
            ? cartItem.get("productVariantId")
            : null,
          quantity: cartItem.get("quantity"),
          cost: cartItem.get("originalPrice"),
        })
          .then(async () => {
            //update stock
            const product = await getProductById(cartItem.get("productId"));
            const productVariant = await getProductVariantsById(
              cartItem.get("productVariantId"),
              cartItem.get("productId")
            );
            if (productVariant) {
              await editProductVariantById(cartItem.get("productVariantId"), {
                stock: productVariant.get("stock") - cartItem.get("quantity"),
              });
            } else {
              await editProductById(cartItem.get("productId"), {
                stock: product.get("stock") - cartItem.get("quantity"),
              });
            }
          })
          .then(() => {
            //delete cart item
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

  async getOrder(query) {
    const order = await getOrders({ ...query, userId: this.userId });
    return order;
  }

  async getProductOrdersByUserId(query) {
    const orderItems = await getOrderItems({
      ...query,
      productOwnerId: this.userId,
    });
    return orderItems;
  }

  async getOrderItemsByOrderId(orderId) {
    const orderItems = await getOrderItems({
      productOwnerId: this.userId,
      orderId: orderId,
    });
    return orderItems;
  }

  async updateOrder(orderId, status) {
    const order = updateOrder(orderId, status);
    return order;
  }

  async updateOrderItem(orderId, orderItemId, status) {
    const orderItem = await updateOrderItemStatus(orderItemId, status);
    await this.checkOrderStatus(orderId);
    return orderItem;
  }

  //check if all order items have same status, if so, update order status
  async checkOrderStatus(orderId) {
    const orderItems = await this.getOrderItemsByOrderId(orderId);
    //check if all values are same in array
    const orderItemsStatus = orderItems.map((orderItem) => {
      return orderItem.get("statusId");
    });
    const isSame = orderItemsStatus.every((status) => {
      return status === orderItemsStatus[0];
    });
    if (isSame) {
      await this.updateOrder(orderId, orderItemsStatus[0]);
    }
    //if not same, set to the lowest status
    else {
      const lowestStatus = orderItemsStatus.reduce((a, b) => {
        return a < b ? a : b;
      });
      await this.updateOrder(orderId, lowestStatus);
    }
  }
}

//export class
module.exports = OrderServices;
