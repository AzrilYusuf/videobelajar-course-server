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
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataUser = req.body;
                if (!dataUser.fullname ||
                    !dataUser.email ||
                    !dataUser.phone_number ||
                    !dataUser.password) {
                    res.status(400).json({
                        error: 'All fields must be filled in!',
                    });
                    throw new Error('All fields must be filled in!');
                }
                yield user_model_1.default.createNewUser(dataUser);
                res.status(201).json({ message: 'The user successfully created!' });
            }
            catch (error) {
                console.error(`${error}`);
                res.json({ error: error.message });
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map