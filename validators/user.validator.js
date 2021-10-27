const Joi = require('joi');
const { EMAIL_REGEXP } = require('../configs/constants');

const createUserValidator = Joi.object({
    email: Joi.string().regex(EMAIL_REGEXP).trim().required(),
    password: Joi.string().trim().required(),
    role: Joi.string().alphanum().min(5).max(7).required(),
});

const loginValidator = Joi.object({
    email: Joi.string().regex(EMAIL_REGEXP).trim().required(),
    password: Joi.string().trim().required(),
});



module.exports = {
    createUserValidator,
    loginValidator
};