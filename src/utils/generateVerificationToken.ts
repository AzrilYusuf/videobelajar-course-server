import crypto from 'crypto';

export default function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
}