"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const userProtectionMiddleware_1 = __importDefault(require("../middlewares/userProtectionMiddleware"));
const usersRouter = express_1.default.Router();
usersRouter.get('/', authMiddleware_1.default, users_controller_1.default.getAllUsers);
usersRouter.get('/:id', authMiddleware_1.default, userProtectionMiddleware_1.default, users_controller_1.default.getUserById);
usersRouter.put('/:id', authMiddleware_1.default, userProtectionMiddleware_1.default, users_controller_1.default.updateUser);
usersRouter.delete('/:id', authMiddleware_1.default, userProtectionMiddleware_1.default, users_controller_1.default.deleteUser);
exports.default = usersRouter;
//# sourceMappingURL=users.router.js.map