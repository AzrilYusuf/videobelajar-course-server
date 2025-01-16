import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use('/', usersRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server Running on port ${process.env.SERVER_PORT}`);
});
