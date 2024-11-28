"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validationSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        'any.required': "Email is required.",
        'string.email': "Invalid email.",
    }),
    password: joi_1.default.string().min(8).required().messages({
        'any.required': "Password is required.",
        'string.min': "Password should be at least 8 characters."
    }),
});
const loginValidation = (req, res, next) => {
    const value = validationSchema.validate(req.body);
    if (value.error) {
        res.status(400).json({ 'message': value.error.message });
    }
    else {
        next();
    }
};
exports.default = loginValidation;
