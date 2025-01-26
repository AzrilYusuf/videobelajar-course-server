import Authentications from '../../db/models/authentications';
import handleSequelizeError from '../utils/sequelizeErrorHandler';
import { AuthConstructor } from '../interfaces/authInterface';
import { Op } from 'sequelize';

export default class Auth {
    public id?: number;
    public user_id: number;
    public refresh_token: string;
    private expired_at: Date;

    constructor(auth: AuthConstructor) {
        if (auth) {
            this.id = auth.id;
            this.user_id = auth.user_id;
            this.refresh_token = auth.refresh_token;
            this.expired_at = auth.expired_at;
        }
    }

    async save(): Promise<Auth> {
        try {
            const result: Authentications = await Authentications.create(
                {
                    user_id: this.user_id,
                    refresh_token: this.refresh_token,
                    expired_at: this.expired_at,
                },
                {
                    returning: true,
                }
            );

            return new Auth(result);
        } catch (error) {
            handleSequelizeError(error, 'Saving refresh token to database');
        }
    }

    static async storeRefreshToken(
        userId: number,
        refreshToken: string
    ): Promise<Auth> {
        try {
            // Check how many refresh tokens the user already has
            const existingRefreshTokens: Authentications[] =
                await Authentications.findAll({
                    where: { user_id: userId },
                    order: [['created_at', 'ASC']], // The oldest comes first
                });
            // If the user has more than 3 refresh tokens, remove the oldest one
            // (The user can only have 3 refresh tokens at a time)
            if (existingRefreshTokens.length >= 3) {
                // Remove the oldest refresh token
                await Authentications.destroy({
                    where: { id: existingRefreshTokens[0].id },
                });
            }

            const expiredAt: Date = new Date();
            expiredAt.setMonth(expiredAt.getMonth() + 1);

            const newRefreshToken: Auth = new Auth({
                user_id: userId,
                refresh_token: refreshToken,
                expired_at: expiredAt,
            });
            return newRefreshToken.save();
        } catch (error) {
            handleSequelizeError(error, 'Storing refresh token to database');
        }
    }

    static async findRefreshToken(token: string): Promise<Auth | null> {
        try {
            const result: Authentications | null =
                await Authentications.findOne({
                    where: { refresh_token: token },
                });
            if (!result) return null;

            return new Auth(result);
        } catch (error) {
            handleSequelizeError(error, 'Finding refresh token');
        }
    }

    static async deleteExpiredRefreshToken(userId: number): Promise<void> {
        try {
            const existingRefreshTokens: Authentications[] =
                await Authentications.findAll({
                    where: {
                        user_id: userId,
                        expired_at: { [Op.lt]: new Date() }, // Find expired refresh tokens
                    },
                });

            if (existingRefreshTokens.length > 0) {
                await Authentications.destroy({
                    where: { id: existingRefreshTokens[0].id },
                });
            }
        } catch (error) {
            handleSequelizeError(error, 'Deleting expired refresh token');
        }
    }

    static async deleteRefreshToken(token: string): Promise<void> {
        try {
            await Authentications.destroy({
                where: { refresh_token: token },
            });
        } catch (error) {
            handleSequelizeError(error, 'Deleting refresh token');
        }
    }
}
