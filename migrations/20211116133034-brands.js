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
    .createTable("brands", {
      id: {
        type: "int",
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
      },
      brandName: { type: "string", length: 255, notNull: true },
      thumbnail: { type: "string", notNull: false },
    })
    .then(() => addBrands(db));
};

exports.down = function (db) {
  return db.dropTable("brands");
};

exports._meta = {
  version: 1,
};

//callback function to add brands
function addBrands(db) {
  return brands.forEach((brand) =>
    db.insert("brands", ["brandName", "thumbnail"], brand)
  );
}

//array of audio equipment categories
const brands = [
  ["Sony", "https://logo.clearbit.com/sony.jp"],
  ["Bose", "https://logo.clearbit.com/bose.com"],
  ["JBL", "https://logo.clearbit.com/jbl.com"],
  ["Beats", "https://logo.clearbit.com/beatsbydre.com"],
  ["Apple", "https://logo.clearbit.com/apple.com"],
  ["Samsung", "https://logo.clearbit.com/samsung.com"],
  ["Jaybird", "https://logo.clearbit.com/jaybirdsport.com"],
  ["Skullcandy", "https://logo.clearbit.com/skullcandy.com"],
  ["Logitech", "https://logo.clearbit.com/logitechg.com"],
  ["Razer", "https://logo.clearbit.com/razer.com"],
  ["Baseus", "https://logo.clearbit.com/baseus.com"],
  ["Jabra", "https://logo.clearbit.com/jabra.com"],
  ["Creative", "https://logo.clearbit.com/creative.com"],
  ["Philips", "https://logo.clearbit.com/philips.com"],
  ["Audeze", "https://logo.clearbit.com/audeze.com"],
  ["Audio-Technica", "https://logo.clearbit.com/audio-technica.com"],
  ["Sennheiser", "https://logo.clearbit.com/sennheiser.com"],
  ["Xiomi", "https://logo.clearbit.com/xiaomi.com"],
  ["Other", null],
];
