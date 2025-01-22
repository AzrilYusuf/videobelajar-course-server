"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyTokenFromCookie = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            throw new Error('Unauthorized');
        }
        if (!process.env.ACCESS_TOKEN) {
            throw new Error('ACCESS_TOKEN is not defined');
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
        req.token = decodedToken;
        next();
    }
    catch (error) {
        console.error(`${error}`);
        res.status(403).json({ error: error.message });
        throw new Error(error.message);
    }
};
exports.default = verifyTokenFromCookie;
//# sourceMappingURL=authMiddleware.js.map