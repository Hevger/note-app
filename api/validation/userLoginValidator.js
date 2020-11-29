const Validatior = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateUserLogin(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validatior.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!Validatior.isEmail(data.email)) {
    errors.email = "Email is not valid";
  }

  if (Validatior.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
