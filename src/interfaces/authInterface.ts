import { NextFunction, Request, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from './userInterface';

export interface RequestWithToken extends Request {
    token?: string | JwtPayload;
}

export interface RequestHandlerWithToken extends RequestHandler {
    (req: RequestWithToken, res: Response, next: NextFunction): Promise<void>;
}

export interface AuthConstructor {
    id?: number;
    user_id: number;
    refresh_token: string;
    expired_at: Date;
}

export interface TokenPayload {
    id: number;
    role: Role;
    SECRET_KEY: string;
    expiresIn: string;
}