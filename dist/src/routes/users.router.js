"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const authAdminMiddleware_1 = __importDefault(require("../middlewares/authAdminMiddleware"));
const validator_1 = __importDefault(require("../validators/validator"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const uploaderMiddleware_1 = __importDefault(require("../middlewares/uploaderMiddleware"));
const usersRouter = express_1.default.Router();
usersRouter.get('/all-users', authMiddleware_1.default, authAdminMiddleware_1.default, users_controller_1.default.getAllUsers);
usersRouter.get('/', authMiddleware_1.default, users_controller_1.default.getUserById);
usersRouter.put('/', authMiddleware_1.default, ...validator_1.default.updateUserValidator(), validationMiddleware_1.default, users_controller_1.default.updateUser);
usersRouter.post('/upload-picture', authMiddleware_1.default, uploaderMiddleware_1.default.single('file'), users_controller_1.default.uploadUserPicture);
usersRouter.get('/url-picture', authMiddleware_1.default, users_controller_1.default.getUrlPicture);
usersRouter.delete('/:id', authMiddleware_1.default, authAdminMiddleware_1.default, users_controller_1.default.deleteUser);
exports.default = usersRouter;
//# sourceMappingURL=users.router.js.map