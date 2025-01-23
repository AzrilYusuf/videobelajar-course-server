import jwt from 'jsonwebtoken';
import { TokenPayload } from 'src/interfaces/authInterface';

export default function generateToken(payload: TokenPayload): string {
    return jwt.sign(
        { id: payload.id, role: payload.role }, // payload data
        payload.SECRET_KEY!, // secret key
        { expiresIn: payload.expiresIn } // expiration time
    );
}
