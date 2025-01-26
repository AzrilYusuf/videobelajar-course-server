import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const reqRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again after 10 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (_req: Request, res: Response) => {
        res.status(429).json({
            status: 'Fail',
            message: 'Too many requests from this IP, please try again after 10 minutes',
        });
    }
})

export default reqRateLimiter;