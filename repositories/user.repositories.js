const { consoleLog } = require("../signale.config");
const yup = require("yup");

//import models
const { User, EmailValidator, UserType, Address } = require("../models");

//user

exports.addUser = async (data) => {
  try {
    const userSchema = yup.object().shape({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
      userTypeId: yup.number().required(),
    });

    await userSchema.validate(data, { abortEarly: false });
    const user = new User(data);
    await user.save();
    return user;
  } catch (error) {
    consoleLog.error(error.message);
    throw error;
  }
};
