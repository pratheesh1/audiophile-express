const { apiError, generateToken, verifyToken } = require("../../utils");
const {
  getUser,
  checkIfBlacklisted,
  addBlacklistedToken,
  addUser,
  getUserByEmail,
} = require("../../repositories/user.repositories");
const { createCart } = require("../../repositories/cart.repositories");

//login
exports.login = async (req, res) => {
  let { email, password } = req.body;
  const user = await getUser(email, password);
  if (user) {
    const { email, id } = user;
    const accessToken = generateToken(
      { email, id },
      process.env.JWT_ACCESS_TOKEN,
      "1hr"
    );
    const refreshToken = generateToken(
      { email, id },
      process.env.JWT_REFRESH_TOKEN,
      "7d"
    );
    res.status(200).json({
      accessToken,
      refreshToken,
    });
  } else {
    throw new apiError("Email or password is incorrect", 401);
  }
};

//refresh token
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
      throw new apiError("Refresh token is required", 400);
    } else if (await checkIfBlacklisted(refreshToken)) {
      throw new apiError("Refresh token is blacklisted", 401);
    } else {
      const { email, id } = verifyToken(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN
      );
      const accessToken = generateToken(
        { email, id },
        process.env.JWT_ACCESS_TOKEN,
        "1hr"
      );
      res.status(200).json({
        accessToken,
      });
    }
  } catch (err) {
    throw new apiError(err.message, 401);
  }
};

//logout
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;
    await addBlacklistedToken(refreshToken);
    res.status(200).json({
      message: "Successfully logged out",
    });
  } catch (err) {
    throw new apiError(err.message, 401);
  }
};

//register
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const { user } = await addUser({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      userTypeId: 3,
    });
    if (user) {
      const userId = user.get("id");
      createCart(userId);
      const accessToken = generateToken(
        { email: email, id: userId },
        process.env.JWT_ACCESS_TOKEN,
        "1hr"
      );
      const refreshToken = generateToken(
        { email: email, id: userId },
        process.env.JWT_REFRESH_TOKEN,
        "7d"
      );
      res.status(200).json({
        accessToken,
        refreshToken,
      });
    } else {
      throw new Error("Account with that email already exists");
    }
  } catch (err) {
    throw new apiError(err.message, 401);
  }
};

//get user by email - router checks auth header
exports.getUserData = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await getUserByEmail(email);
    if (user) {
      res.status(200).json({
        user: {
          id: user.get("id"),
          email: user.get("email"),
          firstName: user.get("firstName"),
          lastName: user.get("lastName"),
          userTypeId: user.get("userTypeId"),
        },
      });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    throw new apiError(err.message, 401);
  }
};
