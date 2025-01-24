import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUID } from "uuid";
import User from "./User";
import Wave from "./Wave";

class Comment extends Model {
    public uuid!: string;
    public comment!: string;
    public status!: boolean;
    public is_deleted!: boolean;
    public deletedAt!: Date;
    public userId!: string;
    public waveId!: string;
}

Comment.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUID,
        primaryKey: true,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    modelName: "Comment",
    sequelize,
})

Wave.hasMany(Comment, { foreignKey: "waveId", as: 'wave_comment', onDelete: "CASCADE", onUpdate: "CASCADE" });
Comment.belongsTo(Wave, { foreignKey: "waveId", as: 'wave_comment', onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasMany(Comment, { foreignKey: "userId", as: 'user_comment', onDelete: "CASCADE", onUpdate: "CASCADE" })
Comment.belongsTo(User, { foreignKey: "userId", as: 'user_comment', onDelete: "CASCADE", onUpdate: "CASCADE" })

export default Comment;