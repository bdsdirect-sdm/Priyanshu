"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const uuid_1 = require("uuid");
const Address_1 = __importDefault(require("./Address"));
const User_1 = __importDefault(require("./User"));
class Patient extends sequelize_1.Model {
}
Patient.init({
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
    disease: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    referalstatus: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    referback: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize: db_1.default,
    modelName: 'Patient'
});
User_1.default.hasMany(Patient, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User_1.default, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
User_1.default.hasMany(Patient, { foreignKey: 'referedto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(User_1.default, { foreignKey: 'referedto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Address_1.default.hasMany(Patient, { foreignKey: "address", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Patient.belongsTo(Address_1.default, { foreignKey: "address", onDelete: 'CASCADE', onUpdate: 'CASCADE' });
exports.default = Patient;
