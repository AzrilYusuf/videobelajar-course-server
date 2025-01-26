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

    async uploadUserPicture(
        req: RequestWithToken,
        res: Response
    ): Promise<void> {
        try {
            const userId: number = (req.token as JwtPayload).id;
            const filePicture: Express.Multer.File | undefined = req.file;

            // Check wether the file uploaded successfully
            if (!filePicture) {
                res.status(400).json({ error: 'No picture was uploaded.' });
                throw new Error('No picture was uploaded.');
            }

            const updatedUser: User | null = await User.storeUserPicture(
                userId,
                filePicture.filename
            );
            if (!updatedUser) {
                res.status(404).json({ error: 'The user is not found.' });
                throw new Error('The user is not found.');
            }

            res.status(204).json({ message: 'The picture successfully uploaded!' });
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
