require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
    database: process.env.DB,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

module.exports = {
    async query(text, params) {
        const response = await pool.query(text, params);

        return response;
    }
};
