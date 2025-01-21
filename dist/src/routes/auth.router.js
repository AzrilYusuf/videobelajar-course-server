"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_validator_1 = __importDefault(require("../validators/auth.validator"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authRouter = express_1.default.Router();
authRouter.post('/signup', ...auth_validator_1.default.createUserValidator(), validationMiddleware_1.default, auth_controller_1.default.registerUser);
authRouter.post('/signin', auth_controller_1.default.loginUser);
exports.default = authRouter;
//# sourceMappingURL=auth.router.js.map