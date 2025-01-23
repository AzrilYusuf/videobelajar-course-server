'use strict';
import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    DataTypes,
    ModelStatic,
} from 'sequelize';
import sequelizeConnection from './sequelizeConnection';

export default class Authentications extends Model<
    InferAttributes<Authentications>,
    InferCreationAttributes<Authentications>
> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    id?: number;
    user_id: number;
    refresh_token: string;
    expired_at: Date;

    static associate(models: { [key: string]: ModelStatic<Model> }) {
        this.belongsTo(models.users, {
            foreignKey: 'user_id',
        });
    }
}
Authentications.init(
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        user_id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        refresh_token: {
            allowNull: false,
            type: DataTypes.TEXT,
        },

        expired_at: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        sequelize: sequelizeConnection,
        modelName: 'authentications',
        createdAt: 'created_at',
        updatedAt: false, // Disable `updatedAt`
    }
);
