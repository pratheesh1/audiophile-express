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
    .createTable("frequency_responses", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
      },
      frequencyResponse: { type: "string", length: 255, notNull: true },
    })
    .then(() => addData(db));
};

exports.down = function (db) {
  return db.dropTable("frequency_responses");
};

exports._meta = {
  version: 1,
};

//callback function to add brands
function addData(db) {
  return dataArr.forEach((item) =>
    db.insert("frequency_responses", ["frequencyResponse"], item)
  );
}

//array of audio equipment categories
const dataArr = [
  ["≤ 60 Hz"],
  ["60-120 Hz"],
  ["120-250 Hz"],
  ["250-500 Hz"],
  ["500-1 kHz"],
  ["1-2 kHz"],
  ["2-4 kHz"],
  ["4-6 kHz"],
  ["≥ 6 kHz"],
];
