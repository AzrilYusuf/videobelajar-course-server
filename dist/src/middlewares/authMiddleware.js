"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if ((authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[0]) !== 'Bearer') {
            res.status(401).json({ error: 'Invalid token type.' });
            throw new Error('Invalid token type.');
        }
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Token not provided.' });
            throw new Error('Token not provided.');
        }
        if (!process.env.SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined in environment variables.');
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
        req.token = decodedToken;
        next();
    }
    catch (error) {
        res.status(403).json({ error: error.message });
        throw new Error(error.message);
    }
};
exports.default = verifyToken;
//# sourceMappingURL=authMiddleware.js.map