import express, { Router } from 'express';
import authenticateUser from '../middlewares/authMiddleware';
import Validator from '../validators/validator';
import validateRequest from '../middlewares/validationMiddleware';
import authController from '../controllers/auth.controller';

const authRouter: Router = express.Router();

// Create new user / Sign up user
authRouter.post(
    '/signup',
    ...Validator.registerUserValidator(),
    validateRequest,
    authController.registerUser
);

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
