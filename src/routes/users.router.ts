import express, { Router } from 'express';
import usersController from '../controllers/users.controller';
import authenticateUser from '../middlewares/authMiddleware';
import authorizeAdmin from '../middlewares/authAdminMiddleware';
import Validator from '../validators/validator';
import validateRequest from '../middlewares/validationMiddleware';

const usersRouter: Router = express.Router();

// Get all users
usersRouter.get(
    '/all-users',
    authenticateUser,
    authorizeAdmin,
    usersController.getAllUsers
);

// Get user by id
usersRouter.get(
    '/',
    authenticateUser,
    usersController.getUserById
);

// Update user
usersRouter.put(
    '/',
    authenticateUser,
    ...Validator.updateUserValidator(),
    validateRequest,
    usersController.updateUser
);

// Delete user
usersRouter.delete(
    '/:id',
    authenticateUser,
    authorizeAdmin,
    usersController.deleteUser
);

export default usersRouter;
