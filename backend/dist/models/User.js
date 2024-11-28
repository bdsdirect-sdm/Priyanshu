"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const uuid_1 = require("uuid");
class User extends sequelize_1.Model {
}
User.init({
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: uuid_1.v4,
        primaryKey: true,
        allowNull: false
    },
    firstname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    // fullname:{
    //     type: DataTypes.STRING,
    //     allowNull:false,
    //     get() {
    //         return `${this.firstname} ${this.lastname}`;
    //     },
    // },
    profile_photo: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    },
    doctype: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    dob: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
    },
    is_verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true
    },
    is_deleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    },
    deleted_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: db_1.default,
    modelName: 'User'
});
exports.default = User;
