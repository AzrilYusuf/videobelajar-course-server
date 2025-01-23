import { Request, Response } from 'express';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import bcrypt from 'bcrypt';
import generateToken from '../utils/generateToken';
import { LoginUser, RegisterUser } from '../interfaces/userInterface';

class AuthController {
    async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const dataUser: RegisterUser = req.body;
            const createdUser: User | string | null =
                await User.createNewUser(dataUser);

            // If the user already exists
            if (typeof createdUser === 'string') {
                res.status(400).json({
                    error: `User ${createdUser} already exists.`,
                });
                throw new Error(`User ${createdUser} already exists.`);
            }

            // If the user is not created due to an error in the database
            if (!createdUser) {
                res.status(400).json({ error: 'The user is not created.' });
                throw new Error('The user is not created.');
            }

            res.status(201).json({ message: 'The user successfully created!' });
        } catch (error) {
            console.error(`${error}`);
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }

    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: LoginUser = req.body;
            const tokenFromCookie: string = req.cookies.token;
            const existingUser: User | null = await User.findByEmail(email);
            
            // If the user is not found or the password is not match
            if (!existingUser) {
                res.status(404).json({
                    error: 'The email or password is invalid.',
                });
                throw new Error('The email or password is invalid.');
            }

            // Compare password with the one stored in the database
            const isPasswordValid: boolean = await bcrypt.compare(
                password,
                existingUser.password
            );
            
            // If the user is not found or the password is not match
            if (!isPasswordValid) {
                res.status(404).json({
                    error: 'The email or password is invalid.',
                });
                throw new Error('The email or password is invalid.');
            }

            // * Automatically delete the expired refresh token if it exists
            await Auth.deleteExpiredRefreshToken(existingUser.id!);

            // * Delete the refresh token if the user already has it
            // * in both database and cookies
            if (tokenFromCookie) {
                Auth.deleteRefreshToken(existingUser.id!);
            }

            // Generate access token and refresh token
            const accessToken: string = generateToken({
                id: existingUser.id!,
                role: existingUser.role,
                SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY!,
                expiresIn: '10m',
            });

            const refreshToken: string = generateToken({
                id: existingUser.id!,
                role: existingUser.role,
                SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY!,
                expiresIn: '30d',
            });

            // Save refresh token to the database
            await Auth.storeRefreshToken(existingUser.id!, refreshToken);

            // Set cookie
            res.cookie('token', refreshToken, {
                httpOnly: true, // The cookie only accessible by the web server
                secure: true, // Send the cookie only via HTTPS
                sameSite: 'strict', // The cookie is not accessible by third-party
                maxAge: 60 * 60 * 24 * 30 * 1000, // The cookie will be removed after 30 days
            });

            res.status(200).json({
                message: 'The user successfully logged in!',
                accessToken,
            });
        } catch (error) {
            console.error(`${error}`);
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }
}

export default new AuthController();
