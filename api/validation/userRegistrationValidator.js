const Validatior = require("validator");
const isEmpty = require("./isEmpty");


module.exports = function validateCompanyRegister(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : "";
    data.username = !isEmpty(data.username) ? data.username : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.repassword = !isEmpty(data.repassword) ? data.repassword : "";
    data.email = !isEmpty(data.email) ? data.email : "";

    if (Validatior.isEmpty(data.name)) {
        errors.name = "Name is required";
    }
    
    if (Validatior.isEmpty(data.username)) {
        errors.username = "Username is required";
    }

    if (Validatior.isEmpty(data.password)) {
        errors.password = "Password is required";
    }

    if (!Validatior.isLength(data.password, { min: 6, max: 50 })) {
        errors.password = "Password must be between 6 and 50 characters";
    }

    if (Validatior.isEmpty(data.repassword)) {
        errors.repassword = "Password confirmation is required";
    }

    if (!Validatior.equals(data.password, data.repassword)) {
        errors.password2 = "Passwords must match";
    }

    if (Validatior.isEmpty(data.email)) {
        errors.email = "E-mail is required";
    }

    if (!Validatior.isEmail(data.email)) {
        errors.email = "E-mail is not valid";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
}

