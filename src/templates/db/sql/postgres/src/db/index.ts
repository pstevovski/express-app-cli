import { Pool } from "pg";
import config from "../config/index";

export const pool = new Pool({
    user: config.DB_USER,
    host: config.DB_HOST,
    database: config.DB,
    password: config.DB_PASSWORD,
    port: config.DB_PORT
});

export const query = async(text: string, params: any) => {
    const response = await pool.query(text, params);

    return response;
};
