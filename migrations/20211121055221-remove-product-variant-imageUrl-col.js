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
    .removeColumn("product_variants", "imageThumbnailUrl")
    .then(function () {
      return db.removeColumn("product_variants", "imageUrl");
    });
};

exports.down = function (db) {
  return db
    .addColumn("product_variants", "imageUrl", {
      type: "string",
      length: 255,
      notNull: false,
    })
    .then(function () {
      return db.addColumn("product_variants", "imageThumbnailUrl", {
        type: "string",
        length: 255,
        notNull: false,
      });
    });
};

exports._meta = {
  version: 1,
};
