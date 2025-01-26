import Users from '../../db/models/users';
import { hash } from 'bcrypt';
import handleSequelizeError from '../utils/sequelizeErrorHandler';
import {
    RegisterUser,
    Role,
    UpdateUser,
    UserConstructor,
} from '../interfaces/userInterface';

export default class User {
    public id?: number;
    public fullname: string;
    public email: string;
    private phone_number: string;
    public password: string;
    public picture?: string;
    public role?: Role;
    public is_verified?: boolean;
    public verification_token?: string;

    constructor(user: UserConstructor) {
        if (user) {
            this.id = user.id;
            this.fullname = user.fullname;
            this.email = user.email;
            this.phone_number = user.phone_number;
            this.password = user.password;
            this.picture = user.picture;
            this.role = user.role;
            this.is_verified = user.is_verified;
            this.verification_token = user.verification_token;
        }
    }

    //** Save user information to database (update and create)
    async save(): Promise<User | null> {
        try {
            // Hash password before saving to the database
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
                        picture: this.picture,
                        role: this.role,
                        is_verified: this.is_verified,
                        verification_token: this.verification_token,
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
                        role: this.role!,
                        verification_token: this.verification_token,
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
    static async createNewUser(
        userData: RegisterUser,
        roleParam: Role,
        verificationToken: string
    ): Promise<User | string | boolean | null> {
        try {
            // Check if the user already exists
            const existingUser: User | null = await User.findByEmail(
                userData.email
            );

            if (existingUser?.is_verified === false) {
                return existingUser.is_verified;
            }

            if (existingUser?.is_verified === true || existingUser) {
                return existingUser.email;
            }

            const newUser: User = new User({
                role: roleParam,
                verification_token: verificationToken,
                ...userData,
            });
            return await newUser.save(); // Save new user to the database
        } catch (error) {
            handleSequelizeError(error, 'Creating new user');
        }
    }

    static async verifyEmail(id: number, token: string): Promise<User | null> {
        try {
            const existedUser: User | null = await User.findUserById(id);
            if (!existedUser) {
                return null;
            }
            if (existedUser.verification_token !== token) {
                return null;
            }
            existedUser.is_verified = true;
            existedUser.verification_token = '';
            return existedUser.save();
        } catch (error) {
            handleSequelizeError(error, 'Verifying email');
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
            const existingUser: Users | null = await Users.findByPk(id, {
                attributes: {
                    exclude: ['password'],
                },
            });
            if (!existingUser) return null;
            return new User(existingUser);
        } catch (error) {
            handleSequelizeError(error, 'Finding user by id');
        }
    }

    // ** Find a user by email
    static async findByEmail(email: string): Promise<User | null> {
        try {
            const existingUser: Users | null = await Users.findOne({
                where: {
                    email: email,
                },
            });
            if (!existingUser) return null;
            return new User(existingUser);
        } catch (error) {
            handleSequelizeError(error, 'Finding user by email');
        }
    }

    static async findPictureFileName(
        userId: number
    ): Promise<string | undefined | null> {
        try {
            const existingUser: Users | null = await Users.findOne({
                where: {
                    id: userId,
                },
            });
            if (!existingUser) return null;
            return existingUser.picture;
        } catch (error) {
            handleSequelizeError(error, 'Finding user picture filename by id');
        }
    }

    static async updateUserData(
        userId: number,
        userData: UpdateUser
    ): Promise<User | null> {
        try {
            const existingUser: Users | null = await Users.findByPk(userId);
            if (!existingUser) return null;

            const updatedUser: User = new User({ id: userId, ...userData });
            return await updatedUser.save();
        } catch (error) {
            handleSequelizeError(error, 'Updating user');
        }
    }

    // Store user picture filename in database (Used for storing new user picture or updating user picture)
    static async storePictureFileName(
        userId: number,
        fileName: string
    ): Promise<User | null> {
        try {
            const existedUser: Users | null = await Users.findByPk(userId);
            if (!existedUser) return null; // User not found

            existedUser.picture = fileName; // Update data
            await existedUser.save();
            return new User(existedUser);
        } catch (error) {
            handleSequelizeError(error, 'Storing user picture');
        }
    }

    static async deletePictureFileName(userId: number): Promise<void | null> {
        try {
            const existedUser: User | null = await User.findUserById(userId);
            if (!existedUser) {
                return null;
            }
            existedUser.picture = '';
            await existedUser.save();
        } catch (error) {
            handleSequelizeError(error, 'Deleting user picture');
        }
    }

    static async deleteUser(id: number): Promise<void | null> {
        try {
            const existingUser: Users | null = await Users.findByPk(id);
            if (!existingUser) return null;

            await Users.destroy({ where: { id: existingUser.id } });
        } catch (error) {
            handleSequelizeError(error, 'Deleting user');
        }
    }
}
