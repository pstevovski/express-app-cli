const { Pool } = require("pg");
const config = require("../config/index");

const pool = new Pool({
    database: config.DB,
    user: config.DB_USER,
    host: config.DB_HOST,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
});

module.exports = {
    async query(text, params) {
        const response = await pool.query(text, params);

        return response;
    }
};
