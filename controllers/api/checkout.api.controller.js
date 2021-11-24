const { apiError } = require("../../utils");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CartServices = require("../../services/cart.services");
const OrderServices = require("../../services/order.services");

exports.getCheckout = async (req, res) => {
  try {
    // Get cart
    const cart = new CartServices(req.user.id);
    await cart.updateCartPrice();
    //TODO: check if product is available before allowing checkout

    const cartItems = await cart.getCart();
    // console.log(cartItems.toJSON());

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
            ]
          : [
              item
                .related("product")
                .related("image")
                .pluck("imageThumbnailUrl"),
            ],
      });
      meta.push({
        order: cartItems.toJSON(),
      });
    });

    // create stripe payment object
    const metaData = JSON.stringify(meta);
    const payment = {
      payment_method_types: ["card"],
      line_items: line_items,
      success_url: `${process.env.BASE_URL}/checkout/success`,
      cancel_url: `${process.env.BASE_URL}/checkout/cancel`,
      metadata: {
        orders: metaData,
      },
    };

    res.status(200).json({
      paymentInvoice: payment,
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
