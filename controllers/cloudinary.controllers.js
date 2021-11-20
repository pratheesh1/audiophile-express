const cloudinary = require("cloudinary");
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.signCloudinary = async (req, res) => {
  const paramsToSign = JSON.parse(req.query.params);
  const apiSecret = process.env.CLOUDINARY_SECRET;
  const signature = cloudinary.utils.sign_request(paramsToSign, apiSecret);
  res.send(signature);
};
