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
  return db.addColumn("order_items", "statusId", {
    type: "int",
    unsigned: true,
    notNull: true,
    defaultValue: 1,
    foreignKey: {
      name: "fk_order_items_status",
      table: "statuses",
      rules: {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      },
      mapping: "id",
    },
  });
};

exports.down = function (db) {
  return db
    .removeForeignKey("order_items", "fk_order_items_status")
    .then(() => db.removeColumn("order_items", "statusId"));
};

exports._meta = {
  version: 1,
};
