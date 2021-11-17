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
  return db.createTable("product_custom_tags", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    customTagId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_product_custom_tags_custom_tags",
        table: "custom_tags",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: {
          customTagId: "id",
        },
      },
    },
    productId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_product_custom_tags_products",
        table: "products",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: {
          productId: "id",
        },
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable("product_custom_tags");
};

exports._meta = {
  version: 1,
};
