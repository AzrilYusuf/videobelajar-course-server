"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const usersRouter = express_1.default.Router();
usersRouter.get('/users', users_controller_1.default.getAllUsers);
usersRouter.get('/users/:id', users_controller_1.default.getUserById);
usersRouter.post('/signup', users_controller_1.default.createUser);
usersRouter.put('/users/:id', users_controller_1.default.updateUser);
exports.default = usersRouter;
//# sourceMappingURL=users.router.js.map