import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

const uploadsDir: string = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage: multer.StorageEngine = multer.diskStorage({
    destination: (
        _req: Request, //** Always type function params, return value, callback,
        _file: Express.Multer.File, //**  variables for readability and maintainability
        cb: (error: Error | null, destination: string) => void // cb means callback
    ): void => {
        cb(null, 'uploads/');
    },
    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ): void => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const upload = multer({ storage: storage });
export default upload;