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
const sequelizeErrorHandler_1 = require("../utils/sequelizeErrorHandler");
class User {
    constructor(user) {
        if (user) {
            this.id = user.id;
            this.fullname = user.fullname;
            this.email = user.email;
            this.phone_number = user.phone_number;
            this.password = user.password;
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
                    }, {
                        returning: true,
                    });
                    return new User(results);
                }
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.handleSequelizeError)(error, 'Saving user to database');
            }
        });
    }
    static createNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield User.findByEmail(user.email);
                if (existingUser) {
                    return existingUser.email;
                }
                const newUser = new User(user);
                return yield newUser.save();
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.handleSequelizeError)(error, 'Creating new user');
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
                (0, sequelizeErrorHandler_1.handleSequelizeError)(error, 'Finding all users');
            }
        });
    }
    static findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield users_1.default.findByPk(id, {
                    attributes: {
                        exclude: ['password'],
                    },
                });
                if (!user)
                    return null;
                return new User(user);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.handleSequelizeError)(error, 'Finding user by id');
            }
        });
    }
    static findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield users_1.default.findOne({
                    where: {
                        email: email,
                    },
                });
                if (!results)
                    return null;
                return new User(results);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.handleSequelizeError)(error, 'Finding user by email');
            }
        });
    }
    static updateUserData(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield users_1.default.findByPk(userId);
                if (!existingUser) {
                    return null;
                }
                const updatedUser = new User(Object.assign({ id: userId }, userData));
                return yield updatedUser.save();
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.handleSequelizeError)(error, 'Updating user');
            }
        });
    }
    static deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield users_1.default.findByPk(id);
                if (!existingUser) {
                    return null;
                }
                yield users_1.default.destroy({ where: { id } });
                return new User(existingUser);
            }
            catch (error) {
                (0, sequelizeErrorHandler_1.handleSequelizeError)(error, 'Deleting user');
            }
        });
    }
}
exports.default = User;
//# sourceMappingURL=user.model.js.map