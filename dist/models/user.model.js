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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = require('../../db/models');
const bcrypt_1 = require("bcrypt");
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
                if (this.id) {
                    const [results] = yield db.query(`
                    UPDATE users SET fullname = :fullname, email = :email, 
                    phone_number = :phone_number, password = :password, 
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id 
                    RETURNING *
                    `, {
                        replacements: {
                            id: this.id,
                            fullname: this.fullname,
                            email: this.email,
                            phone_number: this.phone_number,
                            password: this.password
                        },
                        type: sequelize_1.QueryTypes.UPDATE,
                    });
                    return new User(results[0]);
                }
                else {
                    const hashedPassword = yield (0, bcrypt_1.hash)(this.password, 10);
                    const [results] = yield db.query(`
                    INSERT INTO users (fullname, email, phone_number, password)
                    VALUES (:fullname, :email, :phone_number, :password)
                    RETURNING *`, {
                        replacements: {
                            fullname: this.fullname,
                            email: this.email,
                            phone_number: this.phone_number,
                            password: hashedPassword
                        },
                        type: sequelize_1.QueryTypes.INSERT,
                    });
                    return new User(results[0]);
                }
            }
            catch (error) {
                console.error(error);
                throw new Error('Error saving user to the database.');
            }
        });
    }
}
exports.default = new User();
//# sourceMappingURL=user.model.js.map