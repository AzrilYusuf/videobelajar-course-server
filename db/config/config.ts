import dotenv from 'dotenv';

dotenv.config();

interface Config {
    development: {
        username: string;
        password: string | null;
        database: string;
        host: string;
        dialect: string;
        use_env_variable?: string;
    };
    test: {
        username: string;
        password: string | null;
        database: string;
        host: string;
        dialect: string;
        use_env_variable?: string;
    };
    production: {
        username: string;
        password: string | null;
        database: string;
        host: string;
        dialect: string;
        use_env_variable?: string;
    };
}

const config: Config = {
    development: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_development',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    },
    test: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_test',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    },
    production: {
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || null,
        database: process.env.DB_NAME || 'database_production',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
    },
};

export default config;
