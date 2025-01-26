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
const users_1 = __importDefault(require("../../db/models/users"));
const bcrypt_1 = require("bcrypt");
const sequelizeErrorHandler_1 = __importDefault(require("../utils/sequelizeErrorHandler"));
class User {
    constructor(user) {
        if (user) {
            this.id = user.id;
            this.fullname = user.fullname;
            this.email = user.email;
            this.phone_number = user.phone_number;
            this.password = user.password;
            this.picture = user.picture;
            this.role = user.role;
            this.is_verified = user.is_verified;
            this.verification_token = user.verification_token;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.password) {
                    this.password = yield (0, bcrypt_1.hash)(this.password, 10);
                }
                if (this.id) {
                    const [rowsUpdated, results] = yield users_1.default.update({
                        fullname: this.fullname,
                        email: this.email,
                        phone_number: this.phone_number,
                        password: this.password,
                        picture: this.picture,
                        role: this.role,
                        is_verified: this.is_verified,
                        verification_token: this.verification_token,
                    }, {
                        where: { id: this.id },
                        returning: true,
                    });
                    if (rowsUpdated === 0) {
                        return null;
                    }
                    return new User(results[0]);
                }
                else {
                    const results = yield users_1.default.create({
                        fullname: this.fullname,
                        email: this.email,
                        phone_number: this.phone_number,
                        password: this.password,
                        role: this.role,
                        verification_token: this.verification_token,
                    }, {
                        returning: true,
                    });
                    return new User(results);
                }
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Saving user to database');
            }
        });
    }
    static createNewUser(userData, roleParam, verificationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield User.findByEmail(userData.email);
                if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.is_verified) === false) {
                    return existingUser.is_verified;
                }
                if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.is_verified) === true || existingUser) {
                    return existingUser.email;
                }
                const newUser = new User(Object.assign({ role: roleParam, verification_token: verificationToken }, userData));
                return yield newUser.save();
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Creating new user');
            }
        });
    }
    static verifyEmail(id, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedUser = yield users_1.default.findByPk(id);
                if (!existedUser) {
                    return null;
                }
                if (existedUser.verification_token !== token) {
                    return null;
                }
                existedUser.is_verified = true;
                existedUser.verification_token = '';
                existedUser.save();
                return new User(existedUser);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Verifying email');
            }
        });
    }
    static findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield users_1.default.findAll({
                    attributes: {
                        exclude: ['password'],
                    },
                });
                return users.map((user) => new User(user));
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Finding all users');
            }
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield users_1.default.findByPk(id, {
                    attributes: {
                        exclude: ['password'],
                    },
                });
                if (!existingUser)
                    return null;
                return new User(existingUser);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Finding user by id');
            }
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield users_1.default.findOne({
                    where: {
                        email: email,
                    },
                });
                if (!existingUser)
                    return null;
                return new User(existingUser);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Finding user by email');
            }
        });
    }
    static updateUserData(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield users_1.default.findByPk(userId);
                if (!existingUser)
                    return null;
                const updatedUser = new User(Object.assign({ id: userId }, userData));
                return yield updatedUser.save();
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Updating user');
            }
        });
    }
    static storeUserPicture(userId, userPicture) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existedUser = yield users_1.default.findByPk(userId);
                if (!existedUser)
                    return null;
                existedUser.picture = userPicture;
                yield existedUser.save();
                return new User(existedUser);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Storing user picture');
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield users_1.default.findByPk(id);
                if (!existingUser)
                    return null;
                yield users_1.default.destroy({ where: { id: existingUser.id } });
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.default)(error, 'Deleting user');
            }
        });
    }
}
exports.default = User;
//# sourceMappingURL=user.model.js.map