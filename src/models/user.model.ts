import Users from '../../db/models/users';
import { hash } from 'bcrypt';
import { handleSequelizeError } from '../utils/sequelizeErrorHandler';
import {
    RegisterUser,
    UpdateUser,
    UserConstructor,
} from '../interfaces/userInterface';

export default class User {
    private id?: number;
    private fullname: string;
    private email: string;
    private phone_number: string;
    public password: string;

    constructor(user: UserConstructor) {
        if (user) {
            this.id = user.id;
            this.fullname = user.fullname;
            this.email = user.email;
            this.phone_number = user.phone_number;
            this.password = user.password;
        }
    }

    //** Save user information to database (update and create)
    async save(): Promise<User | null> {
        try {
            if (this.password) {
                this.password = await hash(this.password!, 10);
            }

            //* Update user
            if (this.id) {
                const [rowsUpdated, results]: [
                    affectedCount: number,
                    affectedRows: Users[],
                ] = await Users.update(
                    {
                        fullname: this.fullname,
                        email: this.email,
                        phone_number: this.phone_number,
                        password: this.password,
                    },
                    {
                        where: { id: this.id },
                        returning: true,
                    }
                );
                if (rowsUpdated === 0) {
                    return null;
                }
                return new User(results[0]);
                //* Create new user
            } else {
                const results: Users = await Users.create(
                    {
                        fullname: this.fullname,
                        email: this.email,
                        phone_number: this.phone_number,
                        password: this.password,
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

    // ** Create a new user (Sign up)
    static async createNewUser(user: RegisterUser): Promise<User | string | null> {
        try {
            // Check if the user already exists
            const existingUser: User | null = await User.findByEmail(
                user.email
            );
            if (existingUser) {
                return existingUser.email;
            }

            const newUser: User = new User(user);
            return await newUser.save(); // Save new user to the database
        } catch (error) {
            handleSequelizeError(error, 'Creating new user');
        }
    }

    // ** Find all users
    static async findAllUsers(): Promise<User[]> {
        try {
            const users: Users[] = await Users.findAll({
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
            const user: Users | null = await Users.findByPk(id, {
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

    // ** Find a user by email
    static async findByEmail(email: string): Promise<User | null> {
        try {
            const results: Users | null = await Users.findOne({
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

    static async updateUserData(
        userId: number,
        userData: UpdateUser
    ): Promise<User | null> {
        try {
            const existingUser: Users | null = await Users.findByPk(userId);
            if (!existingUser) {
                return null;
            }

            const updatedUser: User = new User({ id: userId, ...userData });
            return await updatedUser.save();
        } catch (error) {
            handleSequelizeError(error, 'Updating user');
        }
    }

    static async deleteUser(id: number): Promise<User | null> {
        try {
            const existingUser: Users | null = await Users.findByPk(id);
            if (!existingUser) {
                return null;
            }

            await Users.destroy({ where: { id } });
            return new User(existingUser);
        } catch (error) {
            handleSequelizeError(error, 'Deleting user');
        }
    }
}
