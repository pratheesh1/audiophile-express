const crypto = require("crypto");
const jwt = require("jsonwebtoken");

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

module.exports = {
  apiError,
  getHashedPassword,
  generateToken,
  verifyToken,
};
