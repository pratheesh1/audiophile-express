const { Signale } = require("signale");
var emoji = require("node-emoji");
// https://raw.githubusercontent.com/omnidan/node-emoji/master/lib/emoji.json

const options = {
  disabled: false,
  interactive: false,
  displayFilename: true,
  logLevel: "info",
  secrets: [],
  stream: process.stdout,
  types: {
    success: {
      badge: emoji.get("sweat_smile"),
      color: "green",
      label: "Success",
      logLevel: "info",
    },
    info: {
      badge: emoji.get("information_source"),
      color: "blue",
      label: "fyi",
      logLevel: "info",
    },
    todo: {
      badge: emoji.get("writing_hand"),
      color: "bgYellow",
      label: "todo",
      logLevel: "info",
    },
    variable: {
      badge: emoji.get("point_right"),
      color: "yellow",
      label: "variable",
      logLevel: "info",
    },
    flex: {
      badge: emoji.get("muscle"),
      color: "cyan",
      label: "i did it!",
      logLevel: "info",
    },
  },
};

//logger for main process
exports.consoleLog = new Signale(options);
