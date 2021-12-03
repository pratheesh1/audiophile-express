const { apiError } = require("../../utils");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CartServices = require("../../services/cart.services");
const OrderServices = require("../../services/order.services");

exports.postCheckout = async (req, res) => {
  try {
    // Get cart
    const cart = new CartServices(req.user.id);
    const { addressId, notes } = req.body;

    //update to latest price and get cart
    await cart.updateCartPrice();
    const cartItems = await cart.getCart();

    //send error if cart is empty
    if (!cartItems.length) {
      res.status(400).json({
        message: "Your cart is empty",
      });
      return;
    }

    //check id any items are out of stock
    let noStock = await cart.checkStock();
    // return apiError(res, "Some items are out of stock", 417);
    if (noStock.length) {
      res.status(417).json({
        noStock,
        message: "Some items are out of stock. Your cart has been updated.",
      });
      return;
    }

    // create line items
    let line_items = [];
    let meta = [];

    cartItems.forEach((item) => {
      line_items.push({
        name: item.get("productVariantId")
          ? item.related("productVariant").get("variantName")
          : item.related("product").get("name"),
        amount: item.get("productVariantId")
          ? item.related("productVariant").get("variantCost")
          : item.related("product").get("baseCost"),
        quantity: item.get("quantity"),
        currency: "SGD",
        images: item.get("productVariantId")
          ? [
              item
                .related("productVariant")
                .related("image")
                .pluck("imageThumbnailUrl"),
            ][0]
          : [
              item
                .related("product")
                .related("image")
                .pluck("imageThumbnailUrl"),
            ][0],
      });
      meta.push({
        order: {
          productVariantId: item.get("productVariantId")
            ? item.get("productVariantId")
            : null,
          productId: item.get("productId"),
          quantity: item.get("quantity"),
          amount: item.get("productVariantId")
            ? item.related("productVariant").get("variantCost")
            : item.related("product").get("baseCost"),
        },
      });
    });

    //create order
    const order = new OrderServices(req.user.id);
    const newOrder = await order.checkOut(addressId, notes);

    // create stripe payment object
    const metaData = JSON.stringify(meta);
    const payment = {
      payment_method_types: ["card"],
      line_items: line_items,
      success_url: `${process.env.FRONTEND_BASE_URL}orders`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}cart`,
      metadata: {
        orders: metaData,
        orderId: newOrder.get("id"),
        userId: req.user.id,
      },
    };

    //register session
    const stripeSession = await Stripe.checkout.sessions.create(payment);

    //send stripe session
    res.status(200).json({
      sessionId: stripeSession.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    throw new apiError(err.message, 500);
  }
};
