import express, { Router } from 'express';
import AuthValidator from '../validators/auth.validator';
import validateRequest from '../middlewares/validationMiddleware';
import authController from '../controllers/auth.controller';

const authRouter: Router = express.Router();

// Create new user / Sign up user
authRouter.post(
    '/signup',
    ...AuthValidator.createUserValidator(),
    validateRequest,
    authController.registerUser
);

// Sign in user
authRouter.post(
    '/signin',
    ...AuthValidator.loginUserValidator(),
    validateRequest,
    authController.loginUser
);

export default authRouter;
