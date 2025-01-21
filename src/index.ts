import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.router';
import usersRouter from './routes/users.router';

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: true, credentials: true }));

app.use('/', authRouter);
app.use('/users', usersRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server Running on port ${process.env.SERVER_PORT}`);
});
