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
    .createTable("statuses", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
      },
      name: { type: "string", notNull: true },
    })
    .then(() => addData(db));
};

exports.down = function (db) {
  return db.dropTable("statuses");
};

exports._meta = {
  version: 1,
};

//callback function to add brands
function addData(db) {
  return dataArr.forEach((item) => db.insert("statuses", ["name"], item));
}

//array of audio equipment categories
const dataArr = [
  ["Payment Pending"],
  ["Payment Processed"],
  ["Payment Failed"],
  ["Payment Refunded"],
  ["Payment Cancelled"],
  ["Processing"],
  ["Processed"],
  ["Shipped"],
  ["Cancelled"],
  ["Order Received"],
  ["Order Cancelled"],
  ["Order Returned"],
];
