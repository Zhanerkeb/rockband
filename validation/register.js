const Validator = require('validator');

module.exports = (data) => {
    let errors = {};

    data.name = data.name ? data.name : "";
    data.email = data.email ? data.email : "";
    data.password = data.password ? data.password : "";

    if (!Validator.isLength(data.name, {min: 2, max: 40})) {
        errors.name = 'Name field should contain at least 2 chars and at most 40 chars';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "Email is incorrect"
    }

    if (!Validator.isLength(data.password, {min: 6, max: 40})) {
        errors.password = 'Password field should contain at least 6 chars and at most 40 chars';
    }

    return {
        errors,
        isNotValid: Object.keys(errors).length
    }
};

