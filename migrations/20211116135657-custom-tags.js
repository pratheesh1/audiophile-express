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
  return db.createTable("custom_tags", {
    id: { type: "int", primaryKey: true, autoIncrement: true, unsigned: true },
    tagName: { type: "string", notNull: true },
    tagValue: { type: "string", notNull: false },
    tagDescription: { type: "string", notNull: false },
  });
};

exports.down = function (db) {
  return db.dropTable("custom_tags");
};

exports._meta = {
  version: 1,
};
