"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const uuid_1 = require("uuid");
const User_1 = __importDefault(require("./User"));
class Address extends sequelize_1.Model {
}
Address.init({
    uuid: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: uuid_1.v4,
        primaryKey: true,
        allowNull: false
    },
    street: {
        type: sequelize_1.DataTypes.STRING,
    },
    district: {
        type: sequelize_1.DataTypes.STRING,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
    },
    pincode: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    // userId:{
    //     type: DataTypes.STRING,
    //     allowNull:false,
    //     references:{
    //         model: "User",
    //         key: 'uuid'
    //     },
    //     onDelete: "CASCADE",
    //     onUpdate: "CASCADE"
    // }
}, {
    sequelize: db_1.default,
    modelName: 'Address'
});
User_1.default.hasMany(Address, { foreignKey: "user", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Address.belongsTo(User_1.default, { foreignKey: "user", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
exports.default = Address;
