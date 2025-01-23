import { Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { RequestWithToken } from '../interfaces/authInterface';

const authorizeAdmin = (
    req: RequestWithToken,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Extract token from request object
        const accessToken: string | JwtPayload | undefined = req.token;

        if ((accessToken as JwtPayload).role !== 'Admin') {
            res.status(403).json({
                error: 'Admin only, you do not have permission to access this method.',
            });
            throw new Error(
                'Admin only, you do not have permission to access this method.'
            );
        }
        next();
    } catch (error) {
        console.error(`${error}`);
        res.status(401).json({ error: error.message });
    }
};

export default authorizeAdmin;
