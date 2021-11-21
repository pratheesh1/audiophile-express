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
  return db.createTable("images", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    imageUrl: { type: "string", notNull: true },
    productId: {
      type: "int",
      notNull: false,
      unsigned: true,
      foreignKey: {
        name: "fk_images_products",
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
    productVariantId: {
      type: "int",
      notNull: false,
      unsigned: true,
      foreignKey: {
        name: "fk_images_product_variants",
        table: "product_variants",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: {
          productVariantId: "id",
        },
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable("images");
};

exports._meta = {
  version: 1,
};
