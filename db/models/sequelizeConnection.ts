import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

let sequelizeConnection: Sequelize = new Sequelize(
  process.env.DB_NAME || 'videobelajar',
  process.env.DB_USERNAME || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: 3306,
  }
);

export default sequelizeConnection;
