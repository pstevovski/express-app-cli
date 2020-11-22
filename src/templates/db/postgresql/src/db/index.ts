import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

export default {
    async query(text: string, params: any) {
        const response = await pool.query(text, params);

        return response;
    }
};
