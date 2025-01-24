import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUID } from 'uuid';

class User extends Model {
    public uuid!: string;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public phone!: string
    public password!: string;
    public address_one!: string;
    public address_two!: string;
    public city!: string;
    public state!: string;
    public zip_code!: string;
    public dob!: Date;
    public gender!: string;
    public martial_status!: string;
    public social_security!: string;
    public social!: string;
    public kids!: Number;
    public profile_photo!: string;
    public status!: boolean;
    public isDeleted!: boolean;
    public deletedAt!: Date;
}

User.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUID,
        primaryKey: true,
        allowNull: false
    },
    profile_photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address_one: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address_two: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true
    },
    zip_code: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dob: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    gender: {
        type: DataTypes.ENUM('male', 'female', 'others'),
        allowNull: true
    },
    martial_status: {
        type: DataTypes.ENUM('single', 'married', 'divorced'),
        allowNull: true
    },
    social_security: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    social: {
        type: DataTypes.STRING,
        allowNull: true
    },
    kids: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    modelName: 'User',
    sequelize,
})

export default User;