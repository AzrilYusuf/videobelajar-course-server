"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protectRoute = (req, res, next) => {
    try {
        const token = req.token;
        const { id } = req.params;
        if (token.id != id) {
            res.status(403).json({
                error: 'You are not authorized to access this route.',
            });
            throw new Error('You are not authorized to access this route.');
        }
        next();
    }
    catch (error) {
        console.error(`${error}`);
        res.status(401).json({ error: error.message });
    }
};
exports.default = protectRoute;
//# sourceMappingURL=userAuthProtectionMiddleware.js.map