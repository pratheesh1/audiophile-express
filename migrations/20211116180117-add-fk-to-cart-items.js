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
  return db
    .addForeignKey(
      "cart_items",
      "products",
      "fk_cart_items_products",
      {
        productId: "id",
      },
      {
        onDelete: "RESTRICT",
        onUpdate: "RESTRICT",
      }
    )
    .then(() => {
      db.addForeignKey(
        "cart_items",
        "product_variants",
        "fk_cart_items_product_variants",
        {
          productVariantId: "id",
        },
        {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        }
      );
    });
};

exports.down = function (db) {
  return db
    .removeForeignKey("cart_items", "fk_cart_items_products")
    .then(() => {
      return db.removeForeignKey(
        "cart_items",
        "fk_cart_items_product_variants"
      );
    });
};

exports._meta = {
  version: 1,
};
