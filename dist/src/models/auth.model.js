"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentications_1 = __importDefault(require("../../db/models/authentications"));
const sequelizeErrorHandler_1 = __importDefault(require("../utils/sequelizeErrorHandler"));
const sequelize_1 = require("sequelize");
class Auth {
    constructor(auth) {
        if (auth) {
            this.id = auth.id;
            this.user_id = auth.user_id;
            this.refresh_token = auth.refresh_token;
            this.expired_at = auth.expired_at;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authentications_1.default.create({
                    user_id: this.user_id,
                    refresh_token: this.refresh_token,
                    expired_at: this.expired_at,
                }, {
                    returning: true,
                });
                return new Auth(result);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Saving refresh token to database');
            }
        });
    }
    static storeRefreshToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRefreshTokens = yield authentications_1.default.findAll({
                    where: { user_id: userId },
                    order: [['created_at', 'ASC']],
                });
                if (existingRefreshTokens.length >= 3) {
                    yield authentications_1.default.destroy({
                        where: { id: existingRefreshTokens[0].id },
                    });
                }
                const expiredAt = new Date();
                expiredAt.setMonth(expiredAt.getMonth() + 1);
                const newRefreshToken = new Auth({
                    user_id: userId,
                    refresh_token: refreshToken,
                    expired_at: expiredAt,
                });
                return newRefreshToken.save();
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Storing refresh token to database');
            }
        });
    }
    static findRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield authentications_1.default.findOne({
                    where: { refresh_token: token },
                });
                if (!result)
                    return null;
                return new Auth(result);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Finding refresh token');
            }
        });
    }
    static deleteExpiredRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRefreshTokens = yield authentications_1.default.findAll({
                    where: {
                        user_id: userId,
                        expired_at: { [sequelize_1.Op.lt]: new Date() },
                    },
                });
                if (existingRefreshTokens.length > 0) {
                    yield authentications_1.default.destroy({
                        where: { id: existingRefreshTokens[0].id },
                    });
                }
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Deleting expired refresh token');
            }
        });
    }
    static deleteRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield authentications_1.default.destroy({
                    where: { refresh_token: token },
                });
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Deleting refresh token');
            }
        });
    }
}
exports.default = Auth;
//# sourceMappingURL=auth.model.js.map