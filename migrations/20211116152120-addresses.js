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
    .createTable("addresses", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
      },
      street: { type: "string", length: 255, notNull: true },
      city: { type: "string", length: 255, notNull: true },
      state: { type: "string", length: 255, notNull: true },
      zip: { type: "string", length: 255, notNull: true },
      countryId: { type: "int", notNull: true, unsigned: true },
    })
    .then(() => {
      db.addForeignKey(
        "addresses",
        "countries",
        "fk_addresses_countries",
        {
          countryId: "id",
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
    .removeForeignKey("addresses", "fk_addresses_countries", {
      dropIndex: true,
    })
    .then(() => {
      return db.dropTable("addresses");
    });
};

exports._meta = {
  version: 1,
};
