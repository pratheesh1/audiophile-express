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
    await yup.number().validate(statusId);
    await yup.number().required().validate(addressId);
    await yup.number().required().validate(userId);
    await yup.date().validate(timestamp);
    await yup.string().validate(notes);

    const order = new Order.create({
      statusId: 1,
      userId: userId,
      addressId: addressId,
      timestamp: timestamp,
      notes: notes,
    });
    await order.save();

    return order;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

/*
 * @desc create a new order item
 *
 * @param {number} orderId - order id
 * @param {number} productId - product id
 * @param {number} [productVariantId = null] - product variant id
 * @param {number} quantity - quantity
 * @param {number} cost - cost
 *
 * @returns {object} - bookshelf order item object
 */
exports.createOrderItem = async (
  orderId,
  productId,
  productVariantId = null,
  quantity,
  cost
) => {
  try {
    //validate params
    await yup.number().required().validate(orderId);
    await yup.number().required().validate(productId);
    await yup.number().validate(productVariantId);
    await yup.number().required().validate(quantity);
    await yup.number().required().validate(cost);

    const orderItem = new OrderItem.create({
      orderId,
      productId,
      productVariantId,
      quantity,
      cost,
    });
    await orderItem.save();

    return orderItem;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};
