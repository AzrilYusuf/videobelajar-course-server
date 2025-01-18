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
class UsersController {
    getAllUsers(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.findAllUsers();
                if (!users) {
                    res.status(404).json({ error: 'The users are not found.' });
                    throw new Error('The users are not found.');
                }
                res.status(200).json(users);
            }
            catch (error) {
                console.error(`${error}`);
                res.json({ error: error.message });
            }
        });
    }
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    res.status(400).json({ error: 'The request is invalid' });
                    throw new Error('The request is invalid');
                }
                const user = yield user_model_1.default.findUserById(id);
                if (user === null) {
                    res.status(404).json({ error: 'The user is not found.' });
                    throw new Error('The user is not found.');
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error(`${error}`);
                res.json({ error: error.message });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = req.body;
                if (!newUser.fullname ||
                    !newUser.email ||
                    !newUser.phone_number ||
                    !newUser.password) {
                    res.status(400).json({ error: 'All fields must be filled in!' });
                    throw new Error('All fields must be filled in!');
                }
                const user = yield user_model_1.default.recordNewUser(newUser);
                res.status(201).json(user);
            }
            catch (error) {
                console.error(`${error}`);
                res.json({ error: error.message });
            }
        });
    }
}
exports.default = new UsersController();
//# sourceMappingURL=users.controller.js.map