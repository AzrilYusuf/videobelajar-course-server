import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface RequestToken extends Request {
    token: string | JwtPayload;
}