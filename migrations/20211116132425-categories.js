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
    .createTable("categories", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
      },
      name: { type: "string", length: 255, notNull: true },
    })
    .then(() => addCategories(db));
};

exports.down = function (db) {
  return db.dropTable("categories");
};

exports._meta = {
  version: 1,
};

//callback function to add categories
function addCategories(db) {
  return categories.forEach((category) =>
    db.insert("categories", ["name"], category)
  );
}

//array of audio equipment categories
const categories = [
  ["Headphones"],
  ["Earphones"],
  ["Boomboxes"],
  ["Music Players"],
  ["Speakers"],
  ["Microphones"],
  ["Cables"],
  ["Accessories"],
  ["Amplifiers"],
  ["Mixers"],
  ["Other"],
];
