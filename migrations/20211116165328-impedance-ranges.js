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
    .createTable("impedance_ranges", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
      },
      impedanceValue: { type: "int", notNull: true },
    })
    .then(() => addData(db));
};

exports.down = function (db) {
  return db.dropTable("impedance_ranges");
};

exports._meta = {
  version: 1,
};

//callback function to add brands
function addData(db) {
  return dataArr.forEach((item) =>
    db.insert("impedance_ranges", ["impedanceValue"], item)
  );
}

//array of audio equipment categories
const dataArr = [[16], [32], [50], [64], [65], [110], [300]];
