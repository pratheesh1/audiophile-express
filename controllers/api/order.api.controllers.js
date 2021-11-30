const { apiError } = require("../../utils");

const OrderServices = require("../../services/order.services");

exports.getOrders = async (req, res) => {
  try {
    const query = req.body;
    const order = new OrderServices(req.user.id);
    const orders = await order.getOrder(query);
    res.status(200).json(orders.toJSON());
  } catch (error) {
    throw new apiError(error.message, 400);
  }
};
