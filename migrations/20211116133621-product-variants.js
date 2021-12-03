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
  return db.createTable("product_variants", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    productId: { type: "int", unsigned: true, notNull: true },
    variantName: { type: "string", notNull: true },
    variantDescription: { type: "text", notNull: true },
    variantCost: { type: "int", notNull: true },
    imageURL: { type: "string", notNull: false },
    imageThumbnailURL: { type: "string", notNull: false },
    stock: { type: "int", notNull: true, unsigned: true, defaultValue: 0 },
    productId: { type: "int", unsigned: true, notNull: true },
  });
};

exports.down = function (db) {
  return db.dropTable("product_variants");
};

exports._meta = {
  version: 1,
};
