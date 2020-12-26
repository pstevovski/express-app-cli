// Handle ENV files
require("dotenv").config()

// Get the environment in which the server is currently running
const environment = (process.env.NODE_ENV || "development").toUpperCase();

module.exports = {
    DB: process.env[`DB_${environment}`],
    PORT: process.env.PORT,
    DB_USER: process.env[`DB_USERNAME_${environment}`],
    DB_HOST: process.env[`DB_HOST_${environment}`],
    DB_PASSWORD: process.env[`DB_PASSWORD_${environment}`],
    DB_DIALECT: process.env.DB_DIALECT
};