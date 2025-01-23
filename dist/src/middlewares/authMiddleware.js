"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateUser = (req, res, next) => {
    try {
        const refreshToken = req.cookies.token;
        const { authorization } = req.headers;
        const accessToken = authorization.split(' ')[1];
        if (!authorization || !accessToken || !refreshToken) {
            res.status(401).json({ error: 'Token not provided.' });
            throw new Error('Token not provided.');
        }
        console.log(`access token: ${accessToken}`);
        console.log(`refresh token: ${refreshToken}`);
        if (authorization.split(' ')[0] !== 'Bearer') {
            res.status(401).json({ error: 'Invalid token type.' });
            throw new Error('Invalid token type.');
        }
        const decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY);
        const decodedRefreshToken = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
        if (decodedAccessToken.role === 'Admin' &&
            decodedRefreshToken.role === 'Admin') {
            req.token = decodedAccessToken;
            next();
        }
        if (decodedAccessToken.id !==
            decodedRefreshToken.id ||
            decodedAccessToken.role !==
                decodedRefreshToken.role) {
            res.status(403).json({
                error: 'You are not authorized to access this method.',
            });
            throw new Error('You are not authorized to access this method.');
        }
        req.token = decodedAccessToken;
        next();
    }
    catch (error) {
        res.status(403).json({ error: error.message });
        throw new Error(error.message);
    }
};
exports.default = authenticateUser;
//# sourceMappingURL=authMiddleware.js.map