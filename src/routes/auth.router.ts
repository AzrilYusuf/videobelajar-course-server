import express, { Router } from 'express';
import authController from '../controllers/auth.controller';

const authRouter: Router = express.Router();

// Create new user / Sign up user
authRouter.post('/signup', authController.registerUser);
