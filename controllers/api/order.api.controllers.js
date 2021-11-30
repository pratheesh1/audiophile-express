const { apiError } = require("../../utils");

const OrderServices = require("../../services/order.services");

exports.getOrders = async (req, res) => {
  try {
    const query = req.body;
    console.log("user", req.user);
    const order = new OrderServices(req.user.id);
    const orders = await order.getOrder(query);
    console.log(orders.toJSON());
    res.status(200).json(orders.toJSON());
  } catch (error) {
    throw new apiError(error.message, 400);
  }
};
