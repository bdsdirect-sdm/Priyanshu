// models/Appointment.ts

import { Model, DataTypes, UUIDV4 } from 'sequelize';
import sequelize from '../config/db';
import Patient from './Patient';
import User from './User';

class Appointment extends Model {
    public uuid!: string;
    public patientId!: string;  // Foreign key to Patient model
    public appointmentDate!: Date;
    public type!: 'Consultant' | 'Surgery';  // Enum-like field
    public createdAt!: Date;
    public updatedAt!: Date;
    Patient: any;
}

Appointment.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Patient,
            key: 'uuid', // Foreign key to Patient's UUID
        },
        onDelete: 'CASCADE',  // Ensures appointments are deleted when a patient is deleted
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('Consultant', 'Surgery'),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Appointment',
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
});

Patient.hasMany(Appointment, { foreignKey: 'patientId', as: "pid" });
Appointment.belongsTo(Patient, { foreignKey: 'patientId', as: "pid" });

User.hasMany(Appointment, { foreignKey: 'createdBy', as: 'uid' });
Appointment.belongsTo(User, { foreignKey: 'createdBy', as: 'uid' });

export default Appointment;
