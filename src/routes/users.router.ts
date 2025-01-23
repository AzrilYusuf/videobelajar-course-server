import express, { Router, RequestHandler } from 'express';
import usersController from '../controllers/users.controller';
import authenticateUser from '../middlewares/authMiddleware';
import authorizeAdmin from '../middlewares/authAdminMiddleware';
import Validator from '../validators/validator';
import validateRequest from '../middlewares/validationMiddleware';

const usersRouter: Router = express.Router();

// Get all users
usersRouter.get(
    '/all-users',
    authenticateUser as RequestHandler,
    authorizeAdmin as RequestHandler,
    usersController.getAllUsers
);

// Get user by id
usersRouter.get(
    '/',
    authenticateUser as RequestHandler,
    usersController.getUserById
);

// Update user
usersRouter.put(
    '/',
    authenticateUser as RequestHandler,
    ...Validator.updateUserValidator(),
    validateRequest,
    usersController.updateUser
);

// Delete user
usersRouter.delete(
    '/:id',
    authenticateUser as RequestHandler,
    authorizeAdmin as RequestHandler,
    usersController.deleteUser
);

export default usersRouter;
