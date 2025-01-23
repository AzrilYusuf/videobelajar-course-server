import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LoginUser, RegisterUser } from 'src/interfaces/userInterface';

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
            const existingUser: User | null = await User.findByEmail(email);
            //
            if (!existingUser) {
                res.status(404).json({
                    error: 'The email or password is invalid.',
                });
                throw new Error('The email or password is invalid.');
            }

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

            if (!process.env.SECRET_KEY) {
                throw new Error(
                    'SECRET_KEY is not defined in environment variables.'
                );
            }
            const token: string = jwt.sign(
                { id: existingUser.id, role: existingUser.role },
                process.env.SECRET_KEY,
                { expiresIn: '10m' }
            );

            // Set cookie
            // res.cookie('token', refreshToken, {
            //     httpOnly: true, // The cookie only accessible by the web server
            //     secure: true, // Send the cookie only via HTTPS
            //     sameSite: 'strict', // The cookie is not accessible by third-party
            //     maxAge: 60 * 60 * 1000, // The cookie will be removed after 1 hour
            // });

            res.status(200).json({
                message: 'The user successfully logged in!',
                token: token,
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
