import User from "./User";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUID} from 'uuid';

class Wave extends Model{
    public uuid!: string;
    public photo!: string;
    public video!: string;
    public status!: boolean;
    public isactive!: boolean;
    public isDeleted!: boolean;
    public deletedAt!: Date;
    public text!: string;
    public userId!: string;
    public user_wave!: User;
}

Wave.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUID,
        primaryKey: true,
        },
    photo: {
        type: DataTypes.STRING,
        allowNull:true
    },
    video: {
        type: DataTypes.STRING,
        allowNull:true
    },
    text: {
        type: DataTypes.STRING,
    },
    isactive:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},{
    modelName: 'Wave',
    sequelize
})

User.hasMany(Wave, { foreignKey: 'userId', as: 'user_wave', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Wave.belongsTo(User, { foreignKey: 'userId', as: 'user_wave', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Wave