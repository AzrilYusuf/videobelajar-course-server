'use strict';
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    ModelStatic,
} from 'sequelize';
import sequelizeConnection from './sequelizeConnection';
import { Role } from '../../src/interfaces/userInterface';

export default class Users extends Model<
    InferAttributes<Users>,
    InferCreationAttributes<Users>
> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id?: number;
    fullname: string;
    email: string;
    phone_number: string;
    password: string;
    picture?: string;
    role: Role;
    is_verified?: boolean;
    verification_token?: string;

    static associate(models: { [key: string]: ModelStatic<Model> }) {
        this.hasMany(models.authentications, {
            foreignKey: 'user_id',
        });
    }
}

Users.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        fullname: {
            allowNull: false,
            type: DataTypes.STRING(150),
        },
        email: {
            allowNull: false,
            unique: 'email_unique',
            type: DataTypes.STRING(100),
        },
        phone_number: {
            allowNull: false,
            unique: 'phone_unique',
            type: DataTypes.STRING(15),
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        picture: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },
        role: {
            allowNull: false,
            type: DataTypes.ENUM,
            values: ['Admin', 'User'],
            defaultValue: 'User',
        },
        is_verified: {
            allowNull: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        verification_token: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'users',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
