import { Request, Response } from 'express';
import User from '../models/user.model';
import { UserData } from 'src/interfaces/userInterface';

class UsersController {
    async getAllUsers(_req: Request, res: Response): Promise<void> {
        try {
            const users: User[] = await User.findAllUsers();
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
            const id: number = Number(req.params.id);
            if (!id) {
                res.status(403).json({ error: 'The request is invalid' });
                throw new Error('The request is invalid');
            }

            const user: User | null = await User.findUserById(id);

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
            const dataUser: UserData = req.body;

            // Check if all required fields are provided
            if (
                !dataUser.fullname ||
                !dataUser.email ||
                !dataUser.phone_number ||
                !dataUser.password
            ) {
                res.status(400).json({
                    error: 'All fields must be filled in!',
                });
                throw new Error('All fields must be filled in!');
            }

            await User.recordNewUser(dataUser);
            res.status(201).json({ message: 'The user successfully created!' });
        } catch (error) {
            console.error(`${error}`);
            res.json({ error: error.message });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.id);
            const dataUser: UserData = req.body;
            console.log(`user id from params: ${typeof userId}`);

            if (!userId) {
                res.status(403).json({ error: 'The request is invalid' });
                throw new Error('The request is invalid');
            }

            // Check if all required fields are provided
            if (
                !dataUser.fullname ||
                !dataUser.email ||
                !dataUser.phone_number ||
                !dataUser.password
            ) {
                res.status(400).json({
                    error: 'All fields must be filled in!',
                });
                throw new Error('All fields must be filled in!');
            }

            await User.updateUser({ id: userId, ...dataUser });
            res.status(204).json({ message: 'The user successfully updated!' });
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.id);

            if (!userId) {
                res.status(403).json({ error: 'The request is invalid' });
                throw new Error('The request is invalid');
            }

            await User.deleteUser(userId);
            res.status(204).json({ message: 'The user successfully deleted!' });
        } catch (error) {
            console.error(error);
            res.json({ error: error.message });
        }
    }
}

export default new UsersController();
