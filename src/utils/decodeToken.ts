import jwt, { JwtPayload } from 'jsonwebtoken';

export default function decodeToken(
    token: string,
    SECRET_KEY: string
): JwtPayload {
    return jwt.verify(token, SECRET_KEY) as JwtPayload;
}
