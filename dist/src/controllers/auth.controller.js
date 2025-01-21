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
const user_model_1 = __importDefault(require("../models/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataUser = req.body;
                const createdUser = yield user_model_1.default.createNewUser(dataUser);
                if (typeof createdUser === 'string') {
                    res.status(400).json({
                        error: `User ${createdUser} already exists.`,
                    });
                    throw new Error(`User ${createdUser} already exists.`);
                }
                if (!createdUser) {
                    res.status(400).json({ error: 'The user is not created.' });
                    throw new Error('The user is not created.');
                }
                res.status(201).json({ message: 'The user successfully created!' });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const existingUser = yield user_model_1.default.findByEmail(email);
                if (!existingUser) {
                    res.status(404).json({
                        error: 'The user is not registered yet.',
                    });
                    throw new Error('The user is not registered yet.');
                }
                const isPasswordValid = yield bcrypt_1.default.compare(password, existingUser.password);
                if (!isPasswordValid) {
                    res.status(401).json({ error: 'The password is invalid.' });
                    throw new Error('The password is invalid.');
                }
                if (!process.env.ACCESS_TOKEN) {
                    throw new Error('ACCESS_TOKEN is not defined in environment variables.');
                }
                const token = jsonwebtoken_1.default.sign({ id: existingUser.id }, process.env.ACCESS_TOKEN, {
                    expiresIn: '1h',
                });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 1000,
                });
                res.status(200).json({ message: 'The user successfully logged in!' });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map