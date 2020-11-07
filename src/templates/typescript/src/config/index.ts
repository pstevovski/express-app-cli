import dotenv from "dotenv";

// Handles the usage of .env files
dotenv.config();

// Get the environment in which the server is currently running
const environment: string = (process.env.NODE_ENV || "development").toUpperCase();

// Export the configuration object with accessible ENV's
export default {
    PORT: process.env.PORT || 3000
};
