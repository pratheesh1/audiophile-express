const { apiError, generateToken } = require("../../utils");
const { getUser } = require("../../repositories/user.repositories");

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
