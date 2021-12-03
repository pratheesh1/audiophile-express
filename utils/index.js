const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const format = require("date-fns/format");

class apiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

//generate hashed password
const getHashedPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("base64");
};

//generate token
const generateToken = (data, secret, expiresIn) => {
  return jwt.sign(data, secret, {
    expiresIn: expiresIn,
  });
};

//verify token
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

//custom handlebars helper to format date
const formatDate = (date) => {
  return format(new Date(date), "MM/dd/yyyy");
};

//comparison helper for handlebars
const comparison = (leftValue, operator, rightValue) => {
  return {
    "==": leftValue == rightValue,
    "===": leftValue === rightValue,
    "!=": leftValue != rightValue,
    "!==": leftValue !== rightValue,
    ">": leftValue > rightValue,
    ">=": leftValue >= rightValue,
    "<": leftValue < rightValue,
    "<=": leftValue <= rightValue,
    typeof: typeof leftValue == rightValue,
  }[operator];
};

module.exports = {
  apiError,
  getHashedPassword,
  generateToken,
  verifyToken,
  formatDate,
  comparison,
};
