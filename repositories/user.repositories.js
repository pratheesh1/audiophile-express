const { consoleLog } = require("../signale.config");
const yup = require("yup");
const { getHashedPassword } = require("../utils");
//import models
const { User, EmailValidator, UserType, Address } = require("../models");

//get user by email
exports.getUserByEmail = async (email) => {
  try {
    let user = await User.where({
      email,
    }).fetch({
      require: false,
    });
    return user;
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

//validate login
exports.getUser = async (email, password) => {
  try {
    await yup.string().email().required().validate(email);
    await yup.string().required().validate(password);

    const user = await this.getUserByEmail(email);
    if (user.get("password") === getHashedPassword(password)) {
      //if password is correct add user to session
      return user;
    } else {
      return false;
    }
  } catch (error) {
    consoleLog.error(error);
    throw error;
  }
};

//add new user
exports.addUser = async (data) => {
  try {
    if (await this.getUserByEmail(data.email)) {
      return false;
    }
    const userSchema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
      userTypeId: yup.number().required(),
    });

    await userSchema.validate(data, { abortEarly: false });
    const user = new User({
      ...data,
      password: getHashedPassword(data.password),
    });
    await user.save();
    return user;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
