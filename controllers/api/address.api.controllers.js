const { apiError } = require("../../utils");
const {
  createAddress,
  getCountries,
} = require("../../repositories/address.repositories");

//add new address
exports.addAddress = async (req, res) => {
  try {
    const { street, city, state, zip, countryId } = req.body;
    const newAddress = await createAddress({
      street: street,
      city: city,
      state: state,
      zip: zip,
      countryId: countryId,
    });
    res.status(200).json(newAddress.toJSON());
  } catch (err) {
    throw new apiError(err.message, 401);
  }
};

//get all countries
exports.getCountries = async (req, res) => {
  try {
    const countries = await getCountries();
    res.status(200).json(countries.toJSON());
  } catch (err) {
    throw new apiError(err.message, 401);
  }
};
