const { consoleLog } = require("../signale.config");
const yup = require("yup");

// import models
const { Order, OrderItem } = require("../models");

/************************** Order ************************************/
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

//order query schema
const orderQuerySchema = yup.object().shape({
  userId: yup.number().nullable(),
  statusId: yup.number().nullable(),
  productId: yup.number().nullable(),
  productVariantId: yup.number().nullable(),
});

/*
 * @desc get all orders
 * @param {object} query - query object
 * @param {number} [query.userId = null] - user id
 * @param {number} [query.statusId = null] - status id
 * @param {number} [query.itemStatusId = null] - item status id
 * @param {number} [query.productId = null] - product id
 * @param {number} [query.productVariantId = null] - product variant id
 *
 * @returns {object} - bookshelf order object
 */
exports.getOrders = async (query) => {
  try {
    //validate params
    await orderQuerySchema.validate(query);

    const orders = await Order.query((qb) => {
      if (query?.userId) {
        qb.where("userId", query.userId);
      }
      if (query?.statusId) {
        qb.where("statusId", query.statusId);
      }
      qb.orderBy("timestamp", "desc");
    }).fetchAll({
      withRelated: [
        {
          user: (qb) => {
            qb.column("id", "firstName", "lastName");
          },
        },
        "status",
        "address",
        "orderItem.product",
        "orderItem.productVariant",
        {
          orderItem: (qb) => {
            if (query?.productId) {
              qb.where("productId", query.productId);
            }
            if (query?.productVariantId) {
              qb.where("productVariantId", query.productVariantId);
            }
            if (query?.itemStatusId) {
              qb.where("statusId", query.itemStatusId);
            }
          },
        },
      ],
      require: false,
    });
    return orders;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

/************************** Order Item ************************************/
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
