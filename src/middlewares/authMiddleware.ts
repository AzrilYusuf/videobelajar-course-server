import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestToken } from '../interfaces/authInterface';

const verifyTokenFromCookie = (
    req: RequestToken,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Extract token from cookies
        const token: string = req.cookies.token;

        if (!token) {
            res.status(401).json({ error: 'Unauthorized' });
            throw new Error('Unauthorized');
        }

        if (!process.env.ACCESS_TOKEN) {
            throw new Error('ACCESS_TOKEN is not defined');
        }

        const decodedToken: string | JwtPayload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN
        );
        req.token = decodedToken; // TODO: Attach token to the request object
        next(); // TODO: Proceed to the next middleware or route handler
    } catch (error) {
        console.error(`${error}`);
        res.status(403).json({ error: error.message });
        throw new Error(error.message);
    }
};

export default verifyTokenFromCookie;
