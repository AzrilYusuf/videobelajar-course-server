'use strict';
import { Model, InferAttributes, InferCreationAttributes, DataTypes, Sequelize } from 'sequelize';

const sequelize = new Sequelize();

    class Users extends Model<InferAttributes<Users>, InferCreationAttributes<Users>> {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        id!: number;
        fullname!: string;
        email!: string;
        phone_number!: string;
        password!: string;
        created_at!: Date;
        updated_at!: Date;

        static associate(models: any) {
            // define association here
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
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
        },
        {
            sequelize,
            modelName: 'users',
        }
    );

