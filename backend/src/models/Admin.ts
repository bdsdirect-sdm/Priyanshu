// import { Model, DataTypes } from "sequelize";
// import sequelize from "../config/db";
// import { v4 as UUID } from 'uuid';

// class Admin extends Model {
//     public uuid!: string;
//     public firstname!: string;
//     public lastname!: string;
//     public email!: string;
//     public status!: boolean;
//     public isDeleted!: boolean;
//     public deletedAt!: Date;
// }

// Admin.init({
//     uuid: {
//         type: DataTypes.UUID,
//         defaultValue: UUID,
//         primaryKey: true,
//         allowNull: false
//     },
//     firstname: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     lastname: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     email: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     status: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: true,
//     },
//     isDeleted: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false,
//     },
//     deletedAt: {
//         type: DataTypes.DATE,
//         allowNull: true,
//     }
// }, {
//     modelName: 'Admin',
//     sequelize
// })

// export default Admin;
/////////
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/db";
import { v4 as UUID } from 'uuid';

class Admin extends Model {
    public uuid!: string;
    public firstname!: string;
    public lastname!: string;
    public email!: string;
    public password!: string; // Added password field
    public status!: boolean;
    public isDeleted!: boolean;
    public deletedAt!: Date;
}

Admin.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: UUID,
        primaryKey: true,
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
    password: {
        type: DataTypes.STRING,
        allowNull: false // Ensuring password is required
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    modelName: 'Admin',
    sequelize
})

export default Admin;
