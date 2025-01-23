import { Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import decodeToken from '../utils/decodeToken';
import { RequestWithToken } from '../interfaces/authInterface';

// TODO: Authenticate and authorize user
const authenticateUser = (
    req: RequestWithToken,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Extract token from cookies headers
        const refreshToken: string = req.cookies.token;
        const { authorization }: { authorization?: string } = req.headers;

        const accessToken: string = authorization!.split(' ')[1];
        // Check if the token is provided
        if (!authorization || !accessToken || !refreshToken) {
            res.status(401).json({ error: 'Token not provided.' });
            throw new Error('Token not provided.');
        }

        // Check if the token is in the correct format
        if (authorization!.split(' ')[0] !== 'Bearer') {
            res.status(401).json({ error: 'Invalid token type.' });
            throw new Error('Invalid token type.');
        }

        const decodedAccessToken: JwtPayload = decodeToken(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET_KEY!
        );

        const decodedRefreshToken: JwtPayload = decodeToken(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY!
        );

        //** Check if the role is Admin then proceed to the next middleware or route handler
        if (
            decodedAccessToken.role === 'Admin' &&
            decodedRefreshToken.role === 'Admin'
        ) {
            req.token = decodedAccessToken; // TODO: Attach token to the request object
            next(); // TODO: Proceed to the next middleware or route handler
        }

        //** Type casting is used to access the id property only if the variable is an object(JwtPayload)
        //** The other way is use question mark (?)
        if (
            decodedAccessToken.id !==
                decodedRefreshToken.id ||
            decodedAccessToken.role !==
                decodedRefreshToken.role
        ) {
            res.status(403).json({
                error: 'You are not authorized to access this method.',
            });
            throw new Error('You are not authorized to access this method.');
        }
        req.token = decodedAccessToken; // TODO: Attach token to the request object
        next(); // TODO: Proceed to the next middleware or route handler
    } catch (error) {
        res.status(403).json({ error: error.message });
        throw new Error(error.message);
    }
};

export default authenticateUser;
