const { consoleLog } = require("../signale.config");
const yup = require("yup");

// import models
const { Order, OrderItem } = require("../models");

/*
 * @desc create a new order
 *
 * @param {addressId} addressId - address id
 * @param {number} userId - user id
 * @param {timestamp} timestamp - timestamp
 * @param {string} notes - special note for the order
 *
 * @returns {object} - order object
 */
exports.createOrder = async (
  userId,
  addressId,
  timestamp = Date.now(),
  notes
) => {
  try {
    //validate params
    await yup.number().required().validate(addressId);
    await yup.number().required().validate(userId);
    await yup.string().nullable().validate(notes);

    const order = new Order({
      statusId: 1,
      userId: userId,
      addressId: addressId,
      notes: notes ? notes : null,
    });
    await order.save();

    return order;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

//order item schema
const orderItemSchema = yup.object().shape({
  orderId: yup.number().required(),
  productId: yup.number().required(),
  productVariantId: yup.number().nullable(),
  quantity: yup.number().required(),
  cost: yup.number().required(),
});
/*
 * @desc create a new order item
 *
 * @param {object} orderItem - order item object
 * @param {number} orderItem.orderId - order id
 * @param {number} orderItem.productId - product id
 * @param {number} [orderItem.productVariantId = null] - product variant id
 * @param {number} orderItem.quantity - quantity
 * @param {number} orderItem.cost - cost
 *
 * @returns {object} - bookshelf order item object
 */
exports.createOrderItem = async (orderItem) => {
  try {
    //validate params
    await orderItemSchema.validate(orderItem);

    const item = new OrderItem({
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      productVariantId: orderItem.productVariantId
        ? orderItem.productVariantId
        : null,
      quantity: orderItem.quantity,
      cost: orderItem.cost,
    });
    await item.save();

    return item;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};
