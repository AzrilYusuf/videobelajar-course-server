import {
    ValidationError,
    UniqueConstraintError,
    DatabaseError,
} from 'sequelize';

/**
 * Handle Sequelize errors and return meaningful messages.
 * @param error - The error object thrown in a Sequelize operation
 * @param context - A string to provide context about where the error occurred
 */

export function handleSequelizeError(
    error: unknown,
    context: string = 'Operation'
): never {
    if (error instanceof ValidationError) {
        console.error(`${context} - Validation Error:`, error.errors);
        throw new Error(
            'Invalid data provided. Please check your input fields.'
        );
    } else if (error instanceof UniqueConstraintError) {
        console.error(`${context} - Unique Constraint Error:`, error.errors);
        throw new Error('Duplicate entry found. Please use a unique value.');
    } else if (error instanceof DatabaseError) {
        console.error(`${context} - Database Error:`, error.message);
        throw new Error('A database error occurred. Please try again later.');
    } else {
        console.error(`${context} - Error:`, (error as Error).message);
        throw new Error((error as Error).message);
    }
}
