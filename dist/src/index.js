"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_router_1 = __importDefault(require("./routes/auth.router"));
const users_router_1 = __importDefault(require("./routes/users.router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use('/', auth_router_1.default);
app.use('/users', users_router_1.default);
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server Running on port ${process.env.SERVER_PORT}`);
});
//# sourceMappingURL=index.js.map