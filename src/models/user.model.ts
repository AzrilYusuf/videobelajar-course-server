import Users from '../../db/models/users';
import { hash } from 'bcrypt';
import { UserData } from '../interfaces/userInterface';
import { handleSequelizeError } from '../utils/sequelizeErrorHandler';

export default class User {
    private id?: number;
    private fullname?: string;
    private email?: string;
    private phone_number?: string;
    private password?: string;

    constructor(user?: UserData) {
        if (user) {
            this.id = user.id;
            this.fullname = user.fullname;
            this.email = user.email;
            this.phone_number = user.phone_number;
            this.password = user.password;
        }
    }

    //** Save user information to database (update and create)
    async save(): Promise<User> {
        try {
            //* Update user
            if (this.id) {
                const hashedPassword = await hash(this.password!, 10);
                // the result of the update = [affectedCount: number, affectedRows: Users[]]
                const [rowsUpdated, results] = await Users.update(
                    {
                        fullname: this.fullname,
                        email: this.email,
                        phone_number: this.phone_number,
                        password: hashedPassword,
                    },
                    {
                        where: { id: this.id },
                        returning: true,
                    }
                );
                if (rowsUpdated === 0) {
                    throw new Error('No changes were made.');
                }
                return new User(results[0]); // const results: [affectedCount: number, affectedRows: Users[]]
                //* Create new user
            } else {
                const hashedPassword = await hash(this.password!, 10);
                // Check if all required fields are provided
                if (
                    !this.fullname ||
                    !this.email ||
                    !this.phone_number ||
                    !hashedPassword
                ) {
                    throw new Error('Data is invalid');
                }
                const results = await Users.create(
                    {
                        fullname: this.fullname,
                        email: this.email,
                        phone_number: this.phone_number,
                        password: hashedPassword,
                    },
                    {
                        returning: true,
                    }
                );
                return new User(results);
            }
        } catch (error) {
            handleSequelizeError(error, 'Saving user to database');
        }
    }

    // ** Find all users
    static async findAllUsers(): Promise<User[]> {
        try {
            const users = await Users.findAll({
                attributes: {
                    exclude: ['password'],
                },
            });
            return users.map((user) => new User(user));
        } catch (error) {
            handleSequelizeError(error, 'Finding all users');
        }
    }

    // ** Find a user by id
    static async findUserById(id: number): Promise<User | null> {
        try {
            const user = await Users.findByPk(id, {
                attributes: {
                    exclude: ['password'],
                },
            });
            if (!user) return null;
            return new User(user);
        } catch (error) {
            handleSequelizeError(error, 'Finding user by id');
        }
    }

    // ** Create a new user (Sign up)
    static async recordNewUser(user: UserData): Promise<User> {
        try {
            // Check if email is provided
            if (!user.email) {
                throw new Error('Email is required!');
            }

            // Check if the user already exists
            const existingUser = await User.findByEmail(user.email);
            if (existingUser) {
                throw new Error(`User ${user.email} already exists`);
            }

            const newUser = new User(user);
            return await newUser.save(); // Save new user to the database
        } catch (error) {
            handleSequelizeError(error, 'Creating new user');
        }
    }

    // ** Find a user by email
    static async findByEmail(email: string): Promise<User | null> {
        try {
            const results = await Users.findOne({
                where: {
                    email: email,
                },
            });
            if (!results) return null;
            return new User(results);
        } catch (error) {
            handleSequelizeError(error, 'Finding user by email');
        }
    }

    static async updateUser(user: UserData): Promise<User> {
        try {
            const existingUser = await Users.findByPk(user.id);
            if (!existingUser) {
                throw new Error('User not found.');
            }
            const updatedUser = new User(user);

            return await updatedUser.save();
        } catch (error) {
            handleSequelizeError(error, 'Updating user');
        }
    }

    static async deleteUser(id: number): Promise<User> {
        try {
            const existingUser = await Users.findByPk(id);
            if (!existingUser) {
                throw new Error('User not found.');
            }
            await Users.destroy({ where: { id } });
            return new User(existingUser);
        } catch (error) {
            handleSequelizeError(error, 'Deleting user');
        }
    }
}
