"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const env_1 = require("../environment/env");
const DB_NAME = env_1.Local.DB_NAME;
const DB_USER = env_1.Local.DB_USER;
const DB_PASSWORD = env_1.Local.DB_PASSWORD;
const DB_HOST = env_1.Local.DB_HOST;
const DB_DIALECT = env_1.Local.DB_DIALECT;
const sequelize = new sequelize_1.Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql'
});
exports.default = sequelize;
