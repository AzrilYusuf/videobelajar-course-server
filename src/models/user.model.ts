import { QueryTypes } from 'sequelize';
const db = require('../../db/models');
import { hash } from 'bcrypt';

class User {
    private id?: number;
    private fullname?: string;
    private email?: string;
    private phone_number?: string;
    private password?: string;

    constructor(user?: User) {
        if (user) {
            this.id = user.id;
            this.fullname = user.fullname;
            this.email = user.email;
            this.phone_number = user.phone_number;
            this.password = user.password;
        }
    }

    async save(): Promise<User> {
        try {
            if (this.id) {
                // Using array desctructuring to get the first result[0(the real data)
                //  (because the second result[1] is metadata)
                const [results] = await db.query(`
                    UPDATE users SET fullname = :fullname, email = :email, 
                    phone_number = :phone_number, password = :password, 
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id 
                    RETURNING *
                    `,
                    {
                        replacements: {
                            id: this.id,
                            fullname: this.fullname,
                            email: this.email,
                            phone_number: this.phone_number,
                            password: this.password
                        }, 
                        type: QueryTypes.UPDATE,
                    }
                );
                return new User(results[0]);
            } else {
                const hashedPassword = await hash(this.password!, 10);
                const [results] = await db.query(`
                    INSERT INTO users (fullname, email, phone_number, password)
                    VALUES (:fullname, :email, :phone_number, :password)
                    RETURNING *`,
                    {
                        replacements: {
                            fullname: this.fullname,
                            email: this.email,
                            phone_number: this.phone_number,
                            password: hashedPassword
                        },
                        type: QueryTypes.INSERT,
                    }
                );
                return new User(results[0]);
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error saving user to the database.')
        }
    }
}

export default new User();