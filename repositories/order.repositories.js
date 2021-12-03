const { consoleLog } = require("../signale.config");
const yup = require("yup");

// import models
const { Order, OrderItem } = require("../models");

/************************** Order ************************************/
/**
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

/**
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
        "address.country",
        "orderItem.status",
        "orderItem.product",
        "orderItem.product.image",
        "orderItem.productVariant",
        "orderItem.productVariant.image",
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

/**
 * @desc get order by id
 * @param {number} id - order id
 * @returns {object} - bookshelf order object
 */
exports.getOrderById = async (id) => {
  try {
    //validate params
    await yup.number().required().validate(id);
    const order = await Order.where("id", id).fetch({
      withRelated: [
        "orderItem.status",
        "orderItem.product",
        "orderItem.product.image",
        "orderItem.productVariant",
        "orderItem.productVariant.image",
        {
          user: (qb) => {
            qb.column("id", "firstName", "lastName");
          },
        },
      ],
      require: false,
    });
    return order;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

/**
 * @desc update order
 * @param {number} id - order id
 * @param {number} statusId - status id
 *
 * @returns {boolean} - true if updated
 */
exports.updateOrder = async (id, statusId) => {
  try {
    //validate params
    await yup.number().required().validate(id);
    await yup.number().required().validate(statusId);

    const order = await this.getOrderById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.set("statusId", statusId);
    await order.save();
    return true;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

/**
 * @desc delete order by id
 * @param {number} id - order id
 * @returns {boolean} - true if deleted
 */
exports.deleteOrderById = async (id) => {
  try {
    //validate params
    await yup.number().required().validate(id);

    const order = await this.getOrderById(id);
    if (!order) {
      throw new Error("Order not found");
    }
    await order.destroy();
    return true;
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

/**
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

//query schema
const orderItemQuerySchema = yup.object().shape({
  orderId: yup.number().nullable(),
  productId: yup.number().nullable(),
  productVariantId: yup.number().nullable(),
  orderStatusId: yup.number().nullable(),
  quantity: yup.number().nullable(),
  cost: yup.number().nullable(),
  userId: yup.number().nullable(),
  itemStatusId: yup.number().nullable(),
  productOwnerId: yup.number().nullable(),
});

/**
 * @desc get all order items
 * @param {object} query - query object
 * @param {number} [query.orderId = null] - order id
 * @param {number} [query.productId = null] - product id
 * @param {number} [query.productVariantId = null] - product variant id
 * @param {number} [query.orderStatusId = null] - status id of order
 * @param {number} [query.quantity = null] - quantity
 * @param {number} [query.cost = null] - cost
 * @param {number} [query.userId = null] - user id
 * @param {number} [query.itemStatusId = null] - item status id
 * @param {number} [query.productOwnerId = null] - product owner user id
 *
 * @returns {object} - bookshelf order item object
 */
exports.getOrderItems = async (query) => {
  try {
    //validate params
    await orderItemQuerySchema.validate(query);

    const items = await OrderItem.query((qb) => {
      if (query?.orderId) {
        qb.where("orderId", query.orderId);
      }
      if (query?.productId) {
        qb.where("productId", query.productId);
      }
      if (query?.productVariantId) {
        qb.where("productVariantId", query.productVariantId);
      }
      if (query?.quantity) {
        qb.where("quantity", query.quantity);
      }
      if (query?.cost) {
        qb.where("cost", query.cost);
      }
      if (query?.itemStatusId) {
        qb.where("itemStatusId", query.itemStatusId);
      }
      if (query?.productOwnerId) {
        qb.join("products", "products.id", "order_items.productId");
        qb.where("products.userId", query.productOwnerId);
      }
    }).fetchAll({
      withRelated: [
        "order",
        {
          "order.user": (qb) => {
            if (query?.userId) {
              qb.where("id", query.userId);
            }
            qb.column("id", "firstName", "lastName", "email");
          },
        },
        "order.status",
        "order.address",
        "order.address.country",
        {
          "order.orderItem": (qb) => {
            if (query?.orderStatusId) {
              qb.where("statusId", query.orderStatusId);
            }
          },
        },
        "order.orderItem.status",
        "order.orderItem.product",
        "order.orderItem.product.image",
        "order.orderItem.productVariant",
        "order.orderItem.productVariant.image",
      ],
      require: false,
    });
    return items;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

/**
 * @desc update order item status by id
 * @param {number} id - order item id
 * @param {number} statusId - status id
 * @returns {boolean} - true if updated
 */
exports.updateOrderItemStatus = async (id, statusId) => {
  try {
    //validate params
    await yup.number().required().validate(id);
    await yup.number().required().validate(statusId);

    const item = await OrderItem.where("id", id).fetch({ require: false });
    if (!item) {
      throw new Error("order item not found");
    }

    item.set("statusId", statusId);
    await item.save();

    return true;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};
