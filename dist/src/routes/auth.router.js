"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validator_1 = __importDefault(require("../validators/validator"));
const validationMiddleware_1 = __importDefault(require("../middlewares/validationMiddleware"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const authRouter = express_1.default.Router();
authRouter.post('/signup', ...validator_1.default.registerUserValidator(), validationMiddleware_1.default, auth_controller_1.default.registerUser);
authRouter.post('/signin', ...validator_1.default.loginUserValidator(), validationMiddleware_1.default, auth_controller_1.default.loginUser);
exports.default = authRouter;
//# sourceMappingURL=auth.router.js.map