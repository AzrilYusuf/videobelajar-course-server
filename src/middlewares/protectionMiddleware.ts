import { Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { RequestToken } from '../interfaces/authInterface';

const protectRoute = (
    req: RequestToken,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Extract token from request object
        const token: string | JwtPayload = req.token as { id: string };
        const { id }: { id: string } = req.params as { id: string };
        console.log(token.id);
        console.log(id);

        if (token.id != id) {
            res.status(403).json({
                error: 'You are not authorized to access this route.',
            });
            throw new Error('You are not authorized to access this route.');
        }
        next();
    } catch (error) {
        console.error(`${error}`);
        res.status(401).json({ error: error.message });
    }
};

export default protectRoute;
