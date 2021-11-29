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

    //TODO: check if product is available before allowing checkout

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
        userId: req.user.id,
        order: {
          addressId: addressId,
          notes: notes,
          name: item.get("productVariantId")
            ? item.related("productVariant").get("variantName")
            : item.related("product").get("name"),
          productVariantId: item.get("productVariantId")
            ? item.get("productVariantId")
            : null,
          productId: item.get("productId"),
          quantity: item.get("quantity"),
        },
      });
    });

    // create stripe payment object
    const metaData = JSON.stringify(meta);
    const payment = {
      payment_method_types: ["card"],
      line_items: line_items,
      success_url: `${process.env.FRONTEND_BASE_URL}orders`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}cart`,
      metadata: {
        orders: metaData,
      },
    };

    //register session
    const stripeSession = await Stripe.checkout.sessions.create(payment);

    res.status(200).json({
      sessionId: stripeSession.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (err) {
    throw new apiError(err.message, 500);
  }
};

//create order and update cart after payment
exports.createOrder = async (req, res) => {
  try {
    // Get cart
    const cart = new OrderServices(req.user.id);
    const { addressId, notes } = req.body;
    const order = await cart.checkOut(addressId, notes);
    res.status(200).json(order);
  } catch (err) {
    throw new apiError(err.message, 500);
  }
};

/********************** Stripe Webhooks  **********************/
//process payment
exports.processPayment = async (req, res) => {
  const payload = req.body;
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  let signHeader = req.headers["stripe-signature"];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(payload, signHeader, endpointSecret);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const sessionId = session.id;
    console.log(sessionId), console.log(session);
    //TODO: update order status to paid
  }
  res.status(200).send({ received: true });
};
