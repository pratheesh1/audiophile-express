class apiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

//generate hashed password
const crypto = require("crypto");
const getHashedPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("base64");
};

module.exports = { apiError, getHashedPassword };
