const Validatior = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateNote(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : "";
  data.content = !isEmpty(data.content) ? data.content : "";

  if (Validatior.isEmpty(data.title)) {
    errors.title = "Title is required";
  }

  if (Validatior.isEmpty(data.content)) {
    errors.content = "Content is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
