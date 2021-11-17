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
  return db.addForeignKey(
    "email_validators",
    "users",
    "fk_email_validators_users",
    {
      userId: "id",
    },
    {
      onDelete: "CASCADE",
      onUpdate: "RESTRICT",
    }
  );
};

exports.down = function (db) {
  return db.removeForeignKey("email_validators", "fk_email_validators_users", {
    dropIndex: true,
  });
};

exports._meta = {
  version: 1,
};
