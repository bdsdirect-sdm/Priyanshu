import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUID } from 'uuid';
import User from "./User";

class Request extends Model {
    public uuid!: string;
    public request_status!: Number;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public message!: string;
    public status!: boolean;
    public isDeleted!: boolean;
    public deletedAt!: Date;
    public sent_by!: string;
    public sent_to!: string;
    public url!: string;
}

Request.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUID,
        primaryKey: true,
        allowNull: false
    },
    request_status: {
        type: DataTypes.INTEGER,
        defaultValue: 0  /* 0 for pending, 1 for accepted, 2 for rejected */
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
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
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
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
    },
    sent_to: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'uuid',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: true
    },
    sent_to_mail: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    modelName: 'Request',
    sequelize
})

User.hasMany(Request, { foreignKey: 'sent_by', as: 'sent_by_user', onDelete: 'CASCADE', onUpdate: "CASCADE" });
Request.belongsTo(User, { foreignKey: 'sent_by', as: 'sent_by_user', onDelete: 'CASCADE', onUpdate: "CASCADE" });

User.hasMany(Request, { foreignKey: 'sent_to', as: 'sent_to_user', onDelete: 'CASCADE', onUpdate: "CASCADE" });
Request.belongsTo(User, { foreignKey: 'sent_to', as: 'sent_to_user', onDelete: 'CASCADE', onUpdate: "CASCADE" });

export default Request;