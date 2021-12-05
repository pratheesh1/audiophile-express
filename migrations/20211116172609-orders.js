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
  return db.createTable("orders", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    statusId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_orders_statuses",
        table: "statuses",
        rules: { onDelete: "RESTRICT", onUpdate: "RESTRICT" },
        mapping: {
          statusId: "id",
        },
      },
    },
    addressId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_orders_addresses",
        table: "addresses",
        rules: { onDelete: "RESTRICT", onUpdate: "RESTRICT" },
        mapping: {
          addressId: "id",
        },
      },
    },
    userId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_orders_users",
        table: "users",
        rules: { onDelete: "CASCADE", onUpdate: "RESTRICT" },
        mapping: {
          userId: "id",
        },
      },
    },
    paymentReference: { type: "string", notNull: false },
    timestamp: {
      type: "timestamp",
      notNull: true,
      defaultValue: "now()",
    },
    notes: { type: "string", notNull: false },
  });
};

exports.down = function (db) {
  return db.dropTable("orders");
};

exports._meta = {
  version: 1,
};
