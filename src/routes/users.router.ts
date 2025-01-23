import express, { Router } from 'express';
import usersController from '../controllers/users.controller';
import verifyToken from '../middlewares/authMiddleware';
import protectRoute from '../middlewares/userProtectionMiddleware';

const usersRouter: Router = express.Router();

// Get all users
usersRouter.get(
    '/',
    verifyToken as express.RequestHandler,
    usersController.getAllUsers
);

// Get user by id
usersRouter.get(
    '/:id',
    verifyToken as express.RequestHandler,
    protectRoute as express.RequestHandler,
    usersController.getUserById
);

// Update user
usersRouter.put(
    '/:id',
    verifyToken as express.RequestHandler,
    protectRoute as express.RequestHandler,
    usersController.updateUser
);

// Delete user
usersRouter.delete(
    '/:id',
    verifyToken as express.RequestHandler,
    protectRoute as express.RequestHandler,
    usersController.deleteUser
);

export default usersRouter;
