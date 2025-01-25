import express, { Router } from 'express';
import authenticateUser from '../middlewares/authMiddleware';
import Validator from '../validators/validator';
import validateRequest from '../middlewares/validationMiddleware';
import authController from '../controllers/auth.controller';

const authRouter: Router = express.Router();

// Create new user / Sign up user
authRouter.post(
    '/signup/user',
    ...Validator.registerUserValidator(),
    validateRequest,
    authController.registerUser
);

// Create new admin / Sign up admin
authRouter.post(
    '/signup/admin',
    ...Validator.registerAdminValidator(),
    validateRequest,
    authController.registerAdmin
);

// Verify email
authRouter.get('/verify-email', authController.verifyEmail);

// Sign in user
authRouter.post(
    '/signin',
    ...Validator.loginUserValidator(),
    validateRequest,
    authController.logInUser
);

// Sign out user
authRouter.post('/signout', authenticateUser, authController.logOutUser);

export default authRouter;
