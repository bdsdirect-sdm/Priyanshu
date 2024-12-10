import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";

class Notification extends Model {
    public id!: number;
    public room_id!: number;
    // public sender_id!: number;
    public receiver_id!: number;
    public message!: string;
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        room_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        seen: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "NO",
        },
    },
    {
        sequelize,
        modelName: "Notification",
    }
);

export default Notification;

// doctors.hasMany(Notification, { foreignKey: "receiver_id!" });
// Notification.belongsTo(doctors, { foreignKey: "receiver_id!" });
// doctors.hasMany(Notification, { foreignKey: "sender_id!" });
// Notification.belongsTo(doctors, { foreignKey: "sender_id!" });