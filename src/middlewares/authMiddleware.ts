import { Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
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

        const accessToken: string | undefined = authorization!.split(' ')[1];
        // Check if the token is provided
        if (!authorization || !accessToken || !refreshToken) {
            res.status(401).json({ error: 'Token not provided.' });
            throw new Error('Token not provided.');
        }
        console.log(`access token: ${accessToken}`);
        console.log(`refresh token: ${refreshToken}`);

        // Check if the token is in the correct format
        if (authorization!.split(' ')[0] !== 'Bearer') {
            res.status(401).json({ error: 'Invalid token type.' });
            throw new Error('Invalid token type.');
        }

        const decodedAccessToken: string | JwtPayload = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET_KEY!
        );

        const decodedRefreshToken: string | JwtPayload = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY!
        );

        //** Check if the role is Admin then proceed to the next middleware or route handler
        if (
            (decodedAccessToken as JwtPayload).role === 'Admin' &&
            (decodedRefreshToken as JwtPayload).role === 'Admin'
        ) {
            req.token = decodedAccessToken; // TODO: Attach token to the request object
            next(); // TODO: Proceed to the next middleware or route handler
        }

        //** Type casting is used to access the id property only if the variable is an object(JwtPayload)
        //** The other way is use question mark (?)
        if (
            (decodedAccessToken as JwtPayload).id !==
                (decodedRefreshToken as JwtPayload).id ||
            (decodedAccessToken as JwtPayload).role !==
                (decodedRefreshToken as JwtPayload).role
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
