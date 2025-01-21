import { Request, Response, NextFunction } from 'express';
import { Result, ValidationError, validationResult } from 'express-validator';

const validationMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors: Result<ValidationError> = validationResult(req);
    const errorMessages = errors.array().map((error) => error.msg);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errorMessages });
        throw new Error(errorMessages.join(', '));
    }
    next();
};

export default validationMiddleware;
