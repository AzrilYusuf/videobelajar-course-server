'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelizeConnection_1 = __importDefault(require("./sequelizeConnection"));
class Authentications extends sequelize_1.Model {
    static associate(models) {
        this.belongsTo(models.users, {
            foreignKey: 'user_id',
        });
    }
}
exports.default = Authentications;
Authentications.init({
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
    },
    user_id: {
        allowNull: false,
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    refresh_token: {
        allowNull: false,
        type: sequelize_1.DataTypes.TEXT,
    },
    expired_at: {
        allowNull: false,
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    sequelize: sequelizeConnection_1.default,
    modelName: 'authentications',
    createdAt: 'created_at',
    updatedAt: false,
});
//# sourceMappingURL=authentications.js.map