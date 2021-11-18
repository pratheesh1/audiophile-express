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
  return db.createTable("users", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    firstName: { type: "string", notNull: true },
    lastName: { type: "string", notNull: true },
    email: { type: "string", notNull: true },
    phone: { type: "string", notNull: false },
    password: { type: "string", notNull: true },
    addressId: {
      type: "int",
      notNull: false,
      unsigned: true,
      foreignKey: {
        name: "fk_users_address_id",
        table: "addresses",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          addressId: "id",
        },
      },
    },
    userTypeId: {
      type: "int",
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: "fk_users_user_types",
        table: "user_types",
        rules: {
          onDelete: "RESTRICT",
          onUpdate: "RESTRICT",
        },
        mapping: {
          userTypeId: "id",
        },
      },
    },
    imageUrl: { type: "string", notNull: false },
    isVerified: { type: "boolean", notNull: true, defaultValue: false },
  });
};

exports.down = function (db) {
  return db.dropTable("users");
};

exports._meta = {
  version: 1,
};
