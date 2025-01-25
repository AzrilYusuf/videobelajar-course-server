import { Request, Response } from 'express';
import User from '../models/user.model';
import Auth from '../models/auth.model';
import { compare } from 'bcrypt';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import generateToken from '../utils/generateToken';
import decodeToken from '../utils/decodeToken';
import generateVerificationToken from '../utils/generateVerificationToken';
import transporter from '../utils/nodemailer';
import {
    LoginUser,
    RegisterAdmin,
    RegisterUser,
    Role,
} from '../interfaces/userInterface';
import { RequestWithToken } from '../interfaces/authInterface';

class AuthController {
    // Register a new user
    async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const userData: RegisterUser = req.body;
            const verificationToken: string = generateVerificationToken();
            const createdUser: User | string | boolean | null =
                await User.createNewUser(
                    userData,
                    Role.User,
                    verificationToken
                );

            // If the user already exists but not verified
            if (typeof createdUser === 'boolean') {
                res.status(400).json({
                    error: 'The user already exists, but not verified, please verify your email.',
                });
            }

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

            const verificationUrl: string = `${
                process.env.SERVER_DOMAIN
                    ? `https://${process.env.SERVER_DOMAIN}`
                    : `http://localhost:${process.env.SERVER_PORT} || 3000`
            }/verify-email?token=${verificationToken}&id=${(createdUser as User).id}`;

            // Send verification email
            const emailInfo: SMTPTransport.SentMessageInfo =
                await transporter.sendMail({
                    from: 'Videobelajar Course',
                    to: (createdUser as User).email,
                    subject: 'Email Verification',
                    html: `
                    <h1>Hi, ${(createdUser as User).fullname}</h1>
                    Please click the link below to verify your email: 
                    <a href="${verificationUrl}">Verify Email</a>
                `,
                });

            // If the email is not sent or an error is encountered
            if (!emailInfo.messageId) {
                res.status(500).json({
                    error: `An error occurred while sending the email.
                    ${emailInfo.rejected}`,
                });
                throw new Error('An error occurred while sending the email.');
            }

            res.status(201).json({
                message: `The user successfully created!
                We have sent a verification email to ${(createdUser as User).email}. Please verify your email.
            `,
            });
        } catch (error) {
            console.error(`${error}`);
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }

    async registerAdmin(req: Request, res: Response): Promise<void> {
        try {
            const userData: RegisterAdmin = req.body;

            if (userData.privilege_key !== process.env.PRIVILEGE_KEY) {
                res.status(400).json({
                    error: 'The privilege key is invalid.',
                });
                throw new Error('The privilege key is invalid.');
            }

            const verificationToken: string = generateVerificationToken();
            const createdUser: User | string | boolean | null =
                await User.createNewUser(
                    userData,
                    Role.Admin,
                    verificationToken
                );

            // If the user already exists but not verified
            if (typeof createdUser === 'boolean') {
                res.status(400).json({
                    error: 'The user already exists, but not verified, please verify your email.',
                });
            }

            // If the user already exists
            if (typeof createdUser === 'string') {
                res.status(400).json({
                    error: `User ${createdUser} already exists.`,
                });
                throw new Error(`User ${createdUser} already exists.`);
            }

            // If the user is not created due to an error in the database
            if (!createdUser) {
                res.status(400).json({ error: 'The admin is not created.' });
                throw new Error('The admin is not created.');
            }

            const verificationUrl: string = `${
                process.env.SERVER_DOMAIN
                    ? `https://${process.env.SERVER_DOMAIN}`
                    : `http://localhost:${process.env.SERVER_PORT || 3000}`
            }/verify-email?token=${verificationToken}&id=${(createdUser as User).id}`;

            // Send verification email
            const emailInfo: SMTPTransport.SentMessageInfo =
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: (createdUser as User).email,
                    subject: 'Email Verification',
                    html: `
                <h1>Hi, ${(createdUser as User).fullname}</h1>
                Please click the link below to verify your email: 
                <a href="${verificationUrl}">Verify Email</a>
                `,
                });

            // If the email is not sent or an error is encountered
            if (!emailInfo.messageId) {
                res.status(500).json({
                    error: `An error occurred while sending the email.
                    ${emailInfo.rejected}`,
                });
                throw new Error('An error occurred while sending the email.');
            }

            res.status(201).json({
                message: `The admin successfully created!
                We have sent a verification email to ${(createdUser as User).email}. Please verify your email.
            `,
            });
        } catch (error) {
            console.error(`${error}`);
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }

    async verifyEmail(req: Request, res: Response): Promise<void> {
        try {
            const { token, id } = req.query;
            if (!token || !id) {
                res.status(400).json({
                    error: 'Missing token or id.',
                });
                throw new Error('Missing token or id.');
            }

            const verifiedUser = await User.verifyEmail(
                Number(id),
                String(token)
            );

            // If the user is not found or the token is invalid
            if (!verifiedUser) {
                res.status(400).json({
                    error: 'The token or id is invalid.',
                });
                throw new Error('The token or id is invalid.');
            }

            res.status(200).json({
                message: 'The email is verified. Please sign in.',
            });
        } catch (error) {
            console.error(`${error}`);
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }

    async logInUser(req: Request, res: Response): Promise<void> {
        try {
            const { email, password }: LoginUser = req.body;
            const tokenFromCookie: string = req.cookies.token;
            const existingUser: User | null = await User.findByEmail(email);

            // If the user is not found
            if (!existingUser) {
                res.status(404).json({
                    error: 'The email or password is invalid.',
                });
                throw new Error('The email or password is invalid.');
            }

            if (existingUser.is_verified === false) {
                res.status(403).json({
                    error: 'The user is not verified. Please verify your email.',
                });
                throw new Error(
                    'The user is not verified. Please verify your email.'
                );
            }

            // Compare password with the one stored in the database
            const isPasswordValid: boolean = await compare(
                password,
                existingUser.password
            );

            // If the password is not match
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
                role: existingUser.role!,
                SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY!,
                expiresIn: '10m',
            });

            const refreshToken: string = generateToken({
                id: existingUser.id!,
                role: existingUser.role!,
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

    async logOutUser(req: RequestWithToken, res: Response): Promise<void> {
        try {
            const refreshToken: string = req.cookies.token;
            if (!refreshToken) {
                res.status(204);
            }

            const decodedRefreshToken = decodeToken(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET_KEY!
            );

            // Delete the refresh token from the database
            await Auth.deleteRefreshToken(decodedRefreshToken.id);

            // Delete the refresh token from the cookies
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            res.status(204).json({
                message: 'The user successfully logged out!',
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
