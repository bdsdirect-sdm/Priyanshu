"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Local = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.development" });
exports.Local = {
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    SERVER_PORT: process.env.SERVER_PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    DB_DIALECT: process.env.DB_DIALECT,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER
};
