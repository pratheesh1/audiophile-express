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
  return db.createTable("email_validators", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    validator: { type: "string", notNull: true },
    createdAt: { type: "datetime", notNull: true },
    userId: { type: "int", notNull: true, unsigned: true },
  });
};

exports.down = function (db) {
  return db.dropTable("email_validators");
};

exports._meta = {
  version: 1,
};
