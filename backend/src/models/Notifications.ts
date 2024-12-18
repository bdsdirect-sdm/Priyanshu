import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUIDV4 } from "uuid";
import User from "./User";

class Notification extends Model {
    public uuid!: string;
    public notification!: string;
    public notifyby!: string;
    public notifyto!: string;
    public is_seen!: string;
}

Notification.init({
    uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    notification: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_seen: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: "Notification",
});

User.hasMany(Notification, { foreignKey: "notifyto", as: 'notifiedto', onDelete: "CASCADE", onUpdate: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "notifyto", as: 'notifiedto', onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasMany(Notification, { foreignKey: "notifyby", as: 'notifiedby', onDelete: "CASCADE", onUpdate: "CASCADE" });
Notification.belongsTo(User, { foreignKey: "notifyby", as: 'notifiedby', onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Notification;