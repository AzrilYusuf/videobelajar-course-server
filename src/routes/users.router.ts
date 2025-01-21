import express, { Router } from 'express';
import usersController from '../controllers/users.controller';

const usersRouter: Router = express.Router();

// Get all users
usersRouter.get('/', usersController.getAllUsers);

// Get user by id
usersRouter.get('/:id', usersController.getUserById);

// Update user
usersRouter.put('/:id', usersController.updateUser);

// Delete user
usersRouter.delete('/:id', usersController.deleteUser);

export default usersRouter;
