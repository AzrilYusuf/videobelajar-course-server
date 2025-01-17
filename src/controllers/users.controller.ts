import { Request, Response } from 'express';
import User from '../models/user.model';

class UsersController {
    async getAllUsers(_req: Request, res: Response): Promise<void> {
        try {
            const users = await User.findAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error(`Could not find users : ${error}`);
            res.json({ error: error.message });
        }
    }

    async getUserById() {
        console.log('hello from controller');
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const newUser = req.body;

            if (
                !newUser.fullname ||
                !newUser.email ||
                !newUser.phone_number ||
                !newUser.password
            ) {
                res.status(400);
                throw new Error('All fields must be filled in!');
            }

            const user = await User.recordNewUser(newUser);
            res.status(201).json(user);
        } catch (error) {
            console.error(`Could not create user : ${error}`);
            res.json({ error: error.message });
        }
    }
}

export default new UsersController();
