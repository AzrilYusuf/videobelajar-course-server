import { Request, Response } from 'express';
import User from '../models/user.model';
import { UserData } from 'src/interfaces/userInterface';

class AuthController {
    async registerUser(req: Request, res: Response): Promise<void> {
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

            await User.createNewUser(dataUser);
            res.status(201).json({ message: 'The user successfully created!' });
        } catch (error) {
            console.error(`${error}`);
            res.json({ error: error.message });
        }
    }
}

export default new AuthController();