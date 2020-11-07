// Handles the usage of .env files
require("dotenv").config();

// Get the environment in which the server is currently running
const environment = (process.env.NODE_ENV || "development").toUpperCase();

module.exports = {
    PORT: process.env.PORT || 3000
}
