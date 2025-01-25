import { Request, Response } from 'express';
import User from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { RequestWithToken } from '../interfaces/authInterface';
import { UpdateUser } from 'src/interfaces/userInterface';

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
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }

    async getUserById(req: RequestWithToken, res: Response): Promise<void> {
        try {
            const id: number = (req.token as JwtPayload).id;
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
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }

    async updateUser(req: RequestWithToken, res: Response): Promise<void> {
        try {
            const userId: number = (req.token as JwtPayload).id;
            const userData: UpdateUser = req.body;

            // The user id is required
            if (!userId) {
                res.status(403).json({ error: 'The request is invalid' });
                throw new Error('The request is invalid');
            }

            const updatedUser: User | null = await User.updateUserData(
                userId,
                userData
            );
            if (!updatedUser) {
                res.status(404).json({ error: 'The user is not found.' });
                throw new Error('The user is not found.');
            }

            res.status(204).json({ message: 'The user successfully updated!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }

    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId: number = Number(req.params.id);

            if (!userId) {
                res.status(403).json({ error: 'The request is invalid' });
                throw new Error('The request is invalid');
            }

            const deletedUser: void | null = await User.deleteUser(userId);
            // If the user is not found
            if (deletedUser === null) {
                res.status(404).json({ error: 'The user is not found.' });
                throw new Error('The user is not found.');
            }

            res.status(204).json({ message: 'The user successfully deleted!' });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                error: `An internal server error occurred: ${error.message}`,
            });
        }
    }
}

export default new UsersController();
