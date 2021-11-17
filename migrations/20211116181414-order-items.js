"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("order_items", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    orderId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_order_items_orders",
        table: "orders",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: {
          orderId: "id",
        },
      },
    },
    productId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_order_items_products",
        table: "products",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          productId: "id",
        },
      },
    },
    productVariantId: {
      type: "int",
      unsigned: true,
      notNull: false,
      foreignKey: {
        name: "fk_order_items_product_variants",
        table: "product_variants",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          productVariantId: "id",
        },
      },
    },
    quantity: { type: "int", unsigned: true, notNull: true },
    cost: { type: "int", unsigned: true, notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("order_items");
};

exports._meta = {
  version: 1,
};
