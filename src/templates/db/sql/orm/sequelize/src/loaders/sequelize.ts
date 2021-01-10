import { Sequelize } from "sequelize";
import config from "../config/index";

// Create an instance of Sequelize
const db = new Sequelize(config.DB, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_TYPE,

    // If using SQLite only - if not, remove
    // storage: 'path/to/database.sqlite'
});

export default db;