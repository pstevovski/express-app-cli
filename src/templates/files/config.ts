import { IProjectConfigTemplates } from "../../interfaces/IProject";

// Create CONFIG file based on template and database
export const config_ts = (options: Partial<IProjectConfigTemplates>) => `import dotenv from "dotenv";

// Handles the usage of .env files
dotenv.config();

// Get the environment in which the server is currently running
const environment: string = (process.env.NODE_ENV || "development").toUpperCase();

// Export the configuration object with accessible ENV's
export default {
    PORT: process.env.PORT || 3000,
    ${options.db === "mongodb" ? 'MONGODB_URI: process.env[`MONGODB_URI_${environment}`] || "mongodb://localhost/exampleDb"' : ''}
    ${options.db !== "mongodb" ? `
    DB: process.env.DB,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,` : ""}
    ${options !== "mongodb" ? options.orm ? "DB_DIALECT: process.env.DB_DIALECT" : "DB_PORT: process.env.DB_PORT" : ""}
}`;

export const config_js = (options: Partial<IProjectConfigTemplates>) => `// Handles the usage of .env files
require("dotenv").config();

// Get the environment in which the server is currently running
const environment = (process.env.NODE_ENV || "development").toUpperCase();

module.exports = {
    PORT: process.env.PORT || 3000,
    ${options.db === "mongodb" ? 'MONGODB_URI: process.env[`MONGODB_URI_${environment}`] || "mongodb://localhost/exampleDb"' : "" }
    ${options.db === "postgres" || options.db === "mysql" ? `
    DB: process.env.DB,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_PASSWORD: process.env.DB_PASSWORD,` : ""}
    ${options !== "mongodb" ? options.orm ? "DB_DIALECT: process.env.DB_DIALECT" : "DB_PORT: process.env.DB_PORT" : ""}
}`;
