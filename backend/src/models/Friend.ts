import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUID } from 'uuid';
import User from "./User";

class Friend extends Model{
    public uuid!: string;

    public status!: boolean;
    public isDeleted!: boolean;
    public deletedAt!: Date;
    public user_1_Id!: string;
    public user_2_Id!: string;
}

Friend.init({
    uuid:{
        type: DataTypes.UUID,
        defaultValue: UUID,
        primaryKey: true,
        allowNull: false
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    },
    isDeleted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    deletedAt:{
        type: DataTypes.DATE,
        allowNull: true
    }
},{
    modelName: 'Friend',
    sequelize
})

User.hasMany(Friend, { foreignKey:'user_1_Id', as:'friend_1', onDelete:'CASCADE', onUpdate:"CASCADE" });
Friend.belongsTo(User, { foreignKey:'user_1_Id', as:'friend_1', onDelete:'CASCADE', onUpdate:"CASCADE" });

User.hasMany(Friend, { foreignKey:'user_2_Id', as:'friend_2', onDelete:'CASCADE', onUpdate:"CASCADE" });
Friend.belongsTo(User, { foreignKey:'user_2_Id', as:'friend_2', onDelete:'CASCADE', onUpdate:"CASCADE" });

export default Friend;