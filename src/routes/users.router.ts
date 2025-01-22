import express, { Router } from 'express';
import usersController from '../controllers/users.controller';
import verifyTokenFromCookie from '../middlewares/authMiddleware';
import protectRoute from '../middlewares/protectionMiddleware';

const usersRouter: Router = express.Router();

// Get all users
usersRouter.get(
    '/',
    verifyTokenFromCookie as express.RequestHandler,
    usersController.getAllUsers
);

// Get user by id
usersRouter.get(
    '/:id',
    verifyTokenFromCookie as express.RequestHandler,
    protectRoute as express.RequestHandler,
    usersController.getUserById
);

// Update user
usersRouter.put(
    '/:id',
    verifyTokenFromCookie as express.RequestHandler,
    protectRoute as express.RequestHandler,
    usersController.updateUser
);

// Delete user
usersRouter.delete(
    '/:id',
    verifyTokenFromCookie as express.RequestHandler,
    protectRoute as express.RequestHandler,
    usersController.deleteUser
);

export default usersRouter;
