'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelizeConnection_1 = __importDefault(require("./sequelizeConnection"));
class Users extends sequelize_1.Model {
}
exports.default = Users;
Users.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    fullname: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(150),
    },
    email: {
        allowNull: false,
        unique: 'email_unique',
        type: sequelize_1.DataTypes.STRING(100),
    },
    phone_number: {
        allowNull: false,
        unique: 'phone_unique',
        type: sequelize_1.DataTypes.STRING(15),
    },
    password: {
        allowNull: false,
        type: sequelize_1.DataTypes.STRING(255),
    },
    picture: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING(255),
    },
    role: {
        allowNull: false,
        type: sequelize_1.DataTypes.ENUM,
        values: ['Admin', 'User'],
        defaultValue: 'User',
    },
    is_verified: {
        allowNull: false,
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verification_token: {
        allowNull: true,
        type: sequelize_1.DataTypes.STRING(255),
    },
}, {
    sequelize: sequelizeConnection_1.default,
    modelName: 'users',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
//# sourceMappingURL=users.js.map