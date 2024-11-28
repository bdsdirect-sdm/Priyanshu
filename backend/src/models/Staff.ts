import { Model, DataTypes, UUIDV4 } from "sequelize";
import sequelize from "../config/db";
import User from "./User";

class Staff extends Model {
    public uuid!: number;
    public staffName!: string;
    public email!: string;
    public contact!: string;
    public gender!: string;
}

Staff.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    staffName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'staff_name' // Optional: can be used if you want to customize the column name in the DB
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensures email is unique
        validate: {
            isEmail: true // Validates if the email is in the correct format
        }
    },
    contact: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Staff',
    tableName: 'staff', // Optional: Specify the exact table name
    timestamps: true, // Automatically adds createdAt and updatedAt columns
    underscored: true, // Optional: To use snake_case instead of camelCase for column names
})


User.hasMany(Staff, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: 'referedby', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(Staff, { foreignKey: 'referedto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Staff.belongsTo(User, { foreignKey: 'referedto', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Staff;
