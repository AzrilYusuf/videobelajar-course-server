"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const reqRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP, please try again after 10 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).json({
            status: 'Fail',
            message: 'Too many requests from this IP, please try again after 10 minutes',
        });
    }
});
exports.default = reqRateLimiter;
//# sourceMappingURL=reqRateLimiterMiddleware.js.map