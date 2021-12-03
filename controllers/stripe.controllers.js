const { apiError } = require("../utils");
const Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const OrderServices = require("../services/order.services");

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
  //mark order as paid
  if (event.type === "checkout.session.completed") {
    const data = event.data.object.metadata;
    const sessionId = event.data.object.id;
    const orderService = new OrderServices();

    const orderItems = await orderService.getOrderForStripe(data.orderId);
    if (orderItems) {
      orderItems.map(async (item) => {
        await orderService.updateOrderItem(data.orderId, item.get("id"), 2);
      });
    }
  }

  //rollback order if session expired
  if (event.type === "checkout.session.expired") {
    const data = event.data.object.metadata;

    const orderService = new OrderServices();
    orderService.rollBackOrder(data.orderId);
  }
  res.status(200).send({ received: true });
};
