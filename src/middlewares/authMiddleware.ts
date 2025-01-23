import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestToken } from '../interfaces/authInterface';

const verifyToken = (
    req: RequestToken,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Extract token from cookies
        // const token: string = req.cookies.token;
        const { authorization } = req.headers;

        if (authorization?.split(' ')[0] !== 'Bearer') {
            res.status(401).json({ error: 'Invalid token type.' });
            throw new Error('Invalid token type.');
        }

        const token: string | undefined = authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'Token not provided.' });
            throw new Error('Token not provided.');
        }

        if (!process.env.SECRET_KEY) {
            throw new Error('SECRET_KEY is not defined in environment variables.');
        }

        const decodedToken: string | JwtPayload = jwt.verify(
            token,
            process.env.SECRET_KEY,
        );
        req.token = decodedToken; // TODO: Attach token to the request object
        next(); // TODO: Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ error: error.message });
        throw new Error(error.message);
    }
};

export default verifyToken;
