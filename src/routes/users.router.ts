import express from 'express';
import usersController from '../controllers/users.controller';
const usersRouter = express.Router();

// Get all users
usersRouter.get('/users', usersController.getAllUsers);

// Get user by id
usersRouter.get('/users/:id', usersController.getUserById);

// Create new user
usersRouter.post('/signup', usersController.createUser);

// Update user
usersRouter.put('/users/:id', usersController.updateUser);

// Delete user
usersRouter.delete('/users/:id', usersController.deleteUser);

export default usersRouter;
