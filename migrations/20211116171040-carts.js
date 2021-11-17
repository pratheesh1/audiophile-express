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
  return db.createTable("carts", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    userId: {
      type: "int",
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: "fk_carts_users",
        table: "users",
        rules: {
          onDelete: "CASCADE",
          onUpdate: "RESTRICT",
        },
        mapping: {
          userId: "id",
        },
      },
    },
  });
};

exports.down = function (db) {
  return db.dropTable("carts");
};

exports._meta = {
  version: 1,
};
