const CartServices = require("../services/cart.services");
const {
  createOrder,
  createOrderItem,
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
}

//export class
module.exports = OrderServices;
