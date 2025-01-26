"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_model_1 = __importDefault(require("../models/auth.model"));
const bcrypt_1 = require("bcrypt");
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const decodeToken_1 = __importDefault(require("../utils/decodeToken"));
const generateVerificationToken_1 = __importDefault(require("../utils/generateVerificationToken"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const userInterface_1 = require("../interfaces/userInterface");
class AuthController {
    registerUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const verificationToken = (0, generateVerificationToken_1.default)();
                const createdUser = yield user_model_1.default.createNewUser(userData, userInterface_1.Role.User, verificationToken);
                if (typeof createdUser === 'boolean') {
                    res.status(400).json({
                        error: 'The user already exists, but not verified, please verify your email.',
                    });
                }
                if (typeof createdUser === 'string') {
                    res.status(400).json({
                        error: `User ${createdUser} already exists.`,
                    });
                    throw new Error(`User ${createdUser} already exists.`);
                }
                if (!createdUser) {
                    res.status(400).json({ error: 'The user is not created.' });
                    throw new Error('The user is not created.');
                }
                const verificationUrl = `${process.env.SERVER_DOMAIN
                    ? `https://${process.env.SERVER_DOMAIN}`
                    : `http://localhost:${process.env.SERVER_PORT} || 3000`}/verify-email?token=${verificationToken}&id=${createdUser.id}`;
                const emailInfo = yield nodemailer_1.default.sendMail({
                    from: 'Videobelajar Course',
                    to: createdUser.email,
                    subject: 'Email Verification',
                    html: `
                    <h1>Hi, ${createdUser.fullname}</h1>
                    Please click the link below to verify your email: 
                    <a href="${verificationUrl}">Verify Email</a>
                `,
                });
                if (!emailInfo.messageId) {
                    res.status(500).json({
                        error: `An error occurred while sending the email.
                    ${emailInfo.rejected}`,
                    });
                    throw new Error('An error occurred while sending the email.');
                }
                res.status(201).json({
                    message: `The user successfully created!
                We have sent a verification email to ${createdUser.email}. Please verify your email.
            `,
                });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    registerAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                if (userData.privilege_key !== process.env.PRIVILEGE_KEY) {
                    res.status(400).json({
                        error: 'The privilege key is invalid.',
                    });
                    throw new Error('The privilege key is invalid.');
                }
                const verificationToken = (0, generateVerificationToken_1.default)();
                const createdUser = yield user_model_1.default.createNewUser(userData, userInterface_1.Role.Admin, verificationToken);
                if (typeof createdUser === 'boolean') {
                    res.status(400).json({
                        error: 'The user already exists, but not verified, please verify your email.',
                    });
                }
                if (typeof createdUser === 'string') {
                    res.status(400).json({
                        error: `User ${createdUser} already exists.`,
                    });
                    throw new Error(`User ${createdUser} already exists.`);
                }
                if (!createdUser) {
                    res.status(400).json({ error: 'The admin is not created.' });
                    throw new Error('The admin is not created.');
                }
                const verificationUrl = `${process.env.SERVER_DOMAIN
                    ? `https://${process.env.SERVER_DOMAIN}`
                    : `http://localhost:${process.env.SERVER_PORT || 3000}`}/verify-email?token=${verificationToken}&id=${createdUser.id}`;
                const emailInfo = yield nodemailer_1.default.sendMail({
                    from: process.env.EMAIL_USER,
                    to: createdUser.email,
                    subject: 'Email Verification',
                    html: `
                <h1>Hi, ${createdUser.fullname}</h1>
                Please click the link below to verify your email: 
                <a href="${verificationUrl}">Verify Email</a>
                `,
                });
                if (!emailInfo.messageId) {
                    res.status(500).json({
                        error: `An error occurred while sending the email.
                    ${emailInfo.rejected}`,
                    });
                    throw new Error('An error occurred while sending the email.');
                }
                res.status(201).json({
                    message: `The admin successfully created!
                We have sent a verification email to ${createdUser.email}. Please verify your email.
            `,
                });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, id } = req.query;
                if (!token || !id) {
                    res.status(400).json({
                        error: 'Missing token or id.',
                    });
                    throw new Error('Missing token or id.');
                }
                const verifiedUser = yield user_model_1.default.verifyEmail(Number(id), String(token));
                if (!verifiedUser) {
                    res.status(400).json({
                        error: 'The token or id is invalid.',
                    });
                    throw new Error('The token or id is invalid.');
                }
                res.status(200).json({
                    message: 'The email is verified. Please sign in.',
                });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    logInUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const tokenFromCookie = req.cookies.token;
                const existedUser = yield user_model_1.default.findByEmail(email);
                if (!existedUser) {
                    res.status(404).json({
                        error: 'The email or password is invalid.',
                    });
                    throw new Error('The email or password is invalid.');
                }
                if (existedUser.is_verified === false) {
                    res.status(403).json({
                        error: 'The user is not verified. Please verify your email.',
                    });
                    throw new Error('The user is not verified. Please verify your email.');
                }
                const isPasswordValid = yield (0, bcrypt_1.compare)(password, existedUser.password);
                if (!isPasswordValid) {
                    res.status(404).json({
                        error: 'The email or password is invalid.',
                    });
                    throw new Error('The email or password is invalid.');
                }
                yield auth_model_1.default.deleteExpiredRefreshToken(existedUser.id);
                if (tokenFromCookie) {
                    yield auth_model_1.default.deleteRefreshToken(tokenFromCookie);
                }
                const accessToken = (0, generateToken_1.default)({
                    id: existedUser.id,
                    role: existedUser.role,
                    SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
                    expiresIn: '10m',
                });
                const refreshToken = (0, generateToken_1.default)({
                    id: existedUser.id,
                    role: existedUser.role,
                    SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
                    expiresIn: '30d',
                });
                yield auth_model_1.default.storeRefreshToken(existedUser.id, refreshToken);
                res.cookie('token', refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24 * 30 * 1000,
                });
                res.status(200).json({
                    message: 'The user successfully logged in!',
                    accessToken,
                });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    regenerateAccessToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.token;
                if (!refreshToken) {
                    res.status(401).json({ error: 'Token not provided.' });
                    throw new Error('Token not provided.');
                }
                const storedRefreshToken = yield auth_model_1.default.findRefreshToken(refreshToken);
                if (!storedRefreshToken) {
                    res.status(401).json({ error: 'Invalid token.' });
                    throw new Error('Invalid token.');
                }
                yield auth_model_1.default.deleteExpiredRefreshToken(storedRefreshToken.user_id);
                const decodedRefreshToken = (0, decodeToken_1.default)(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
                const newAccessToken = (0, generateToken_1.default)({
                    id: decodedRefreshToken.id,
                    role: decodedRefreshToken.role,
                    SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
                    expiresIn: '10m',
                });
                res.status(200).json({ accessToken: newAccessToken });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
    logOutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.token;
                if (!refreshToken) {
                    res.status(204);
                }
                yield auth_model_1.default.deleteRefreshToken(refreshToken);
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'strict',
                });
                res.status(204).json({
                    message: 'The user successfully logged out!',
                });
            }
            catch (error) {
                console.error(`${error}`);
                res.status(500).json({
                    error: `An internal server error occurred: ${error.message}`,
                });
            }
        });
    }
}
exports.default = new AuthController();
//# sourceMappingURL=auth.controller.js.map