import { Request, Response } from 'express';
import User from '../models/user.model';

class UsersController {
    async getAllUsers(_req: Request, res: Response): Promise<void> {
        try {
            const users = await User.findAllUsers();
            if (!users) {
                res.status(404).json({ error: 'The users are not found.' });
                throw new Error('The users are not found.');
            }

            res.status(200).json(users);
        } catch (error) {
            console.error(`${error}`);
            res.json({ error: error.message });
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const id: string = req.params.id;
            if (!id) {
                res.status(400).json({ error: 'The request is invalid' });
                throw new Error('The request is invalid');
            }

            const user = await User.findUserById(id);

            // If the user is not found
            if (user === null) {
                res.status(404).json({ error: 'The user is not found.' });
                throw new Error('The user is not found.');
            }

            res.status(200).json(user);
        } catch (error) {
            console.error(`${error}`);
            res.json({ error: error.message });
        }
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const newUser = req.body;

            // Check if all required fields are provided
            if (
                !newUser.fullname ||
                !newUser.email ||
                !newUser.phone_number ||
                !newUser.password
            ) {
                res.status(400).json({ error: 'All fields must be filled in!' });
                throw new Error('All fields must be filled in!');
            }

            const user = await User.recordNewUser(newUser);

            res.status(201).json(user);
        } catch (error) {
            console.error(`${error}`);
            res.json({ error: error.message });
        }
    }
}

export default new UsersController();
