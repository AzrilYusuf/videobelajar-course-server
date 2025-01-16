import { Request, Response } from 'express';
import User from '../models/user.model'

class UsersController {
    async getAllUsers() {
        // const users = await User.findAll();
        console.log('hello from controller');
    }

    async getUserById() {
        console.log('hello from controller');
    }

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.createNewUser(req.body);
            res.status(201).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UsersController();
