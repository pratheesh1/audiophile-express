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
  return db.createTable("products", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    name: { type: "string", notNull: true },
    description: { type: "text", notNull: true },
    baseCost: { type: "int", notNull: true },
    brandId: {
      type: "int",
      notNull: false,
      unsigned: true,
      foreignKey: {
        name: "fk_products_brands",
        table: "brands",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          brandId: "id",
        },
      },
    },
    categoryId: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "fk_products_categories",
        table: "categories",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          categoryId: "id",
        },
      },
    },
    imageUrl: { type: "string", notNull: false },
    imageThumbnailUrl: { type: "string", notNull: false },
    stock: { type: "int", notNull: true, unsigned: true, defaultValue: 0 },
    userId: { type: "int", notNull: false, unsigned: true },
    sku: { type: "string", notNull: false },
    frequencyResponseId: {
      type: "int",
      notNull: false,
      unsigned: true,
      foreignKey: {
        name: "fk_products_frequency_responses",
        table: "frequency_responses",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          frequencyResponseId: "id",
        },
      },
    },
    bluetooth: { type: "boolean", notNull: false, defaultValue: false },
    impedanceRangeId: {
      type: "int",
      notNull: false,
      unsigned: true,
      foreignKey: {
        name: "fk_products_impedance_ranges",
        table: "impedance_ranges",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          impedanceRangeId: "id",
        },
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable("products");
};

exports._meta = {
  version: 1,
};
