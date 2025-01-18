"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSequelizeError = handleSequelizeError;
const sequelize_1 = require("sequelize");
function handleSequelizeError(error, context = 'Operation') {
    if (error instanceof sequelize_1.ValidationError) {
        console.error(`${context} - Validation Error:`, error.errors);
        throw new Error('Invalid data provided. Please check your input fields.');
    }
    else if (error instanceof sequelize_1.UniqueConstraintError) {
        console.error(`${context} - Unique Constraint Error:`, error.errors);
        throw new Error('Duplicate entry found. Please use a unique value.');
    }
    else if (error instanceof sequelize_1.DatabaseError) {
        console.error(`${context} - Database Error:`, error.message);
        throw new Error('A database error occurred. Please try again later.');
    }
    else {
        console.error(`${context} - Error:`, error.message);
        throw new Error(error.message);
    }
}
//# sourceMappingURL=sequelizeErrorHandler.js.map