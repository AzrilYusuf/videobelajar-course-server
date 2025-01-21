"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const validationMiddleware = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    const errorMessages = errors.array().map((error) => error.msg);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errorMessages });
        throw new Error(errorMessages.join(', '));
    }
    next();
};
exports.default = validationMiddleware;
//# sourceMappingURL=validationMiddleware.js.map