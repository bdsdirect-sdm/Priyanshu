import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUID } from "uuid";
import User from "./User";

class Preference extends Model {
  public uuid!: string;
  public language!: string;
  public breakfast!: string;
  public lunch!: string;
  public dinner!: string;
  public wake_time!: string;
  public bed_time!: string;
  public weight_in!: string;
  public weight!: string;
  public height_in!: string;
  public height!: string;
  public blood_glucose_in!: string;
  public blood_glucose!: string;
  public cholesterol_in!: string;
  public cholesterol!: string;
  public blood_pressure_in!: string;
  public blood_pressure!: string;
  public distance_in!: string;
  public distance!: string;
  public system_email!: boolean;
  public sms!: boolean;
  public post!: boolean;
  public member_services_email!: boolean;
  public phone_call!: boolean;
  public UserId!: string;
  public status!: boolean;
  public is_deleted!: boolean;
  public deletedAt!: Date;
}

Preference.init(
  {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: UUID,
      primaryKey: true,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    breakfast: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    lunch: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    dinner: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    wake_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    bed_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    weight_in: {
      type: DataTypes.ENUM('Kg', 'lbs'),
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    height_in: {
      type: DataTypes.ENUM('cm','ft/inches'),
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blood_glucose_in: {
      type: DataTypes.ENUM('mmo/l', 'mg/dl'),
      allowNull: false,
    },
    blood_glucose: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cholesterol_in: {
      type: DataTypes.ENUM('mmo/l', 'mg/dl'),
      allowNull: false,
    },
    cholesterol: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blood_pressure_in: {
      type: DataTypes.ENUM('kPa', 'mmHg'),
      allowNull: false,
    },
    blood_pressure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    distance_in: {
      type: DataTypes.ENUM('km', 'miles'),
      allowNull: false,
    },
    distance: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    system_email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    post: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    member_services_email: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    phone_call: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    status:{
        type: DataTypes.BOOLEAN,
        defaultValue:true
    },
    is_deleted:{
        type: DataTypes.BOOLEAN,
        defaultValue:false
    },
    deletedAt:{
        type: DataTypes.DATE,
        allowNull:true
  }
},
  {
    modelName: "Preference",
    sequelize
  }
);

User.hasOne(Preference, { foreignKey: "userId", as: "user_preference", onDelete: "CASCADE", onUpdate: "CASCADE" });
Preference.belongsTo(User, { foreignKey: "userId", as: "user_preference", onDelete: "CASCADE", onUpdate: "CASCADE" });

export default Preference;
