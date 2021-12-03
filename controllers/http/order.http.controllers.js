//import dal
const OrderServices = require("../../services/order.services");

const { consoleLog } = require("../../signale.config");

exports.getAllOrders = async (req, res) => {
  const user = req.session.user.id;
  const orderId = req.params.orderId;

  const orders = new OrderServices(user);
  const productOrders = await orders.getProductOrdersByUserId();
  const selectedOrder =
    orderId && (await orders.getOrderItemsByOrderId(orderId));

  //remove duplicate orders by orderId
  const uniqueOrders = productOrders
    ?.toJSON()
    .filter(
      (order, index, self) =>
        index === self.findIndex((t) => t.orderId === order.orderId)
    );

  res.render("products/orders", {
    orders: uniqueOrders,
    activeTab: " bg-gray-100 dark:bg-gray-300",
    inactiveTab: " bg-gray-200 dark:bg-gray-500",
    selectedOrder: selectedOrder?.toJSON()[0],
    orderTotal:
      selectedOrder?.toJSON()[0].order.orderItem.reduce(function (total, item) {
        return total + item.cost * item.quantity;
      }, 0) / 100,
  });
};

exports.updateOrderItemStatus = async (req, res) => {
  const user = req.session.user.id;
  const orderId = req.params.orderId;
  const orderItemId = req.params.orderItemId;
  const statusId = req.params.statusId;

  const orders = new OrderServices(user);
  await orders.updateOrderItem(orderId, orderItemId, statusId);
  req.flash("success", "Order Item Status Updated");
  res.redirect(`/orders/${orderId}`);
};
