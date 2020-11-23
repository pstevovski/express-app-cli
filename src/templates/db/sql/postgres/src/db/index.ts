import { Pool } from "pg";
import config from "../config/index";

const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB,
    password: config.DB_PASSWORD,
    port: config.DB_PORT
});

export default {
    async query(text: string, params: any) {
        const response = await pool.query(text, params);

        return response;
    }
};
