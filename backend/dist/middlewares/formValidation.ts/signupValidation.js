"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validationSchema = joi_1.default.object({
    firstname: joi_1.default.string().empty().required().messages({
        'any.required': "First name is required.",
        'string.empty': "First name should be empty ."
    }),
    lastname: joi_1.default.string().empty().required().messages({
        'any.required': "Last name is required.",
        'string.empty': "Last name should be empty."
    }),
    email: joi_1.default.string().email().required().messages({
        'any.required': "Email is required.",
        'string.email': "Invalid email.",
    }),
    password: joi_1.default.string().min(8).required().messages({
        'any.required': "Password is required.",
        'string.min': "Password should be at least 8 characters."
    }),
    doctype: joi_1.default.number().required().messages({
        'any.required': "User type is required.",
    })
});
const signupValidation = (req, res, next) => {
    const value = validationSchema.validate(req.body);
    if (value.error) {
        const errormessages = value.error.details.map(err => err.message);
        res.status(400).json({ 'message': errormessages });
    }
    else {
        next();
    }
};
exports.default = signupValidation;
