import { body, ValidationChain } from 'express-validator';

export default class AuthValidator {
    static createUserValidator(): ValidationChain[] {
        return [
            body('fullname')
                .trim()
                .notEmpty()
                .withMessage('Fullname is required')
                .isString()
                .withMessage(
                    'Fullname should be a letter, alphabet or character'
                )
                .isLength({ min: 4 })
                .withMessage('Fullname must be at least 4 characters long'),

            body('email')
                .trim()
                .notEmpty()
                .withMessage('Email is required')
                .isEmail()
                .withMessage('Email is not valid'),

            body('phone_number')
                .trim()
                .notEmpty()
                .withMessage('Phone number is required')
                .isNumeric()
                .withMessage('Phone number must contain only numbers')
                .isLength({ min: 10, max: 13 })
                .withMessage(
                    'Phone number must be at least 10 or 13 characters long'
                ),

            body('password')
                .notEmpty()
                .withMessage('Password is required')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/\d/)
                .withMessage('Password must contain at least one number')
                .matches(/[A-Z]/)
                .withMessage('Password must contain at least one uppercase letter')
                .matches(/[a-z]/)
                .withMessage('Password must contain at least one lowercase letter')
        ];
    }
}