// src/models/Transaction.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db';

interface TransactionAttributes {
    id?: number;
    orderID: string;
    payerID: string;
    amount: number;
    status: string;
}

class Transaction
    extends Model<TransactionAttributes>
    implements TransactionAttributes {
    public id!: number;
    public orderID!: string;
    public payerID!: string;
    public amount!: number;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        orderID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payerID: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'transactions',
        sequelize, // passing the `sequelize` instance is required
    }
);

export default Transaction;
