const yup = require("yup");

// helper for yup transform function
// code from https://github.com/jquense/yup/issues/298#issuecomment-543791550
function emptyStringToNull(value, originalValue) {
  if (typeof originalValue === "string" && originalValue === "") {
    return null;
  }
  return value;
}

// product query schema
exports.productQuerySchema = yup.object().shape({
  name: yup.string(),
  brand: yup.array().of(yup.number()).nullable(),
  category: yup.array().of(yup.number()).nullable(),
  cost_min: yup.number().integer().nullable().transform(emptyStringToNull),
  cost_max: yup.number().integer().nullable().transform(emptyStringToNull),
  stock_min: yup.number().integer().nullable().transform(emptyStringToNull),
  bluetooth: yup.array().of(yup.number()).nullable(),
  impedanceRangeId: yup.array().of(yup.number()).nullable(),
  frequencyResponseId: yup.array().of(yup.number()).nullable(),
});
