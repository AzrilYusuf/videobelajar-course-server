"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protectRoute = (req, res, next) => {
    try {
        const accessToken = req.token;
        if (accessToken.role !== 'Admin') {
            res.status(403).json({
                error: 'Admin only, you do not have permission to access this method.'
            });
            throw new Error('Admin only, you do not have permission to access this method.');
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