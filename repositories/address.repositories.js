const { consoleLog } = require("../signale.config");
const yup = require("yup");

// import models
const { Address } = require("../models");

//address schema
const addressSchema = yup.object().shape({
  street: yup.string().required(),
  city: yup.string().required(),
  state: yup.string().required(),
  zip: yup.string().required(),
  countryId: yup.number().required(),
});

/*
 * @desc    Create a new address
 *
 * @param   {object} address
 * @param   {string} address.street
 * @param   {string} address.city
 * @param   {string} address.state
 * @param   {string} address.zip
 * @param   {number} address.countryId
 *
 * @returns {object} address - bookshelf address object
 */
exports.createAddress = async (address) => {
  try {
    //validate address
    await addressSchema.validate(address);

    //create address
    const newAddress = new Address(address);
    await newAddress.save();

    //return address
    return newAddress;
  } catch (err) {
    consoleLog(err);
    throw err;
  }
};

/*
 * @desc    Get address by id
 *  @param   {number} addressId
 * @returns {object} address - bookshelf address object
 */
exports.getAddressById = async (addressId) => {
  try {
    await yup.number().required().validate(addressId);

    //get address
    const address = await Address.where({ id: addressId }).fetch();

    //return address
    return address;
  } catch (err) {
    consoleLog(err);
    throw err;
  }
};
