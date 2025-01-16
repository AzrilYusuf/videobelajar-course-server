// import { Request, Response } from 'express';
// import User from '../models/user.model'

class UsersController {
    async getAllUsers() {
        // const users = await User.findAll();
        console.log("hello from controller");
    }

    async getUserById() {
        console.log("hello from controller");
    }

    async createUser() {
        console.log("hello from controller, creating new user...");
    }
}

export default new UsersController();
