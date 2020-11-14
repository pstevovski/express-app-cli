import { IProjectConfigTemplates } from "../../interfaces/IProject";

// Create CONFIG file based on template and database
export const config_ts = (options: Partial<IProjectConfigTemplates>) => `import dotenv from "dotenv";

// Handles the usage of .env files
dotenv.config();

// Get the environment in which the server is currently running
const environment: string = (process.env.NODE_ENV || "development").toUpperCase();

// Remove this line - TS throws error with current tsconfig.json if there are unused variables
console.log("ENVIRONMENT: ", environment);

// Export the configuration object with accessible ENV's
export default {
    PORT: process.env.PORT || 3000,
    ${options.db === "mongodb" ? 'MONGODB_URI: process.env[`MONGODB_URI_${environment}`] || "mongodb://localhost/exampleDb"' : ''}
}`;

export const config_js = (options: Partial<IProjectConfigTemplates>) => `// Handles the usage of .env files
require("dotenv").config();

// Get the environment in which the server is currently running
const environment = (process.env.NODE_ENV || "development").toUpperCase();

module.exports = {
    PORT: process.env.PORT || 3000,
    ${options.db === "mongodb" ? 'MONGODB_URI: process.env[`MONGODB_URI_${environment}`] || "mongodb://localhost/exampleDb"' : "" }
}`;

// Append to .env file based on selected options (database, auth, etc.)
export const env = (options: any) => `# You should NEVER commit this file.

# PORT on which the server will run
PORT = 3000;

${options.db === "mongodb" ? `
# MONGO DB Connection string
MONGODB_URI_DEVELOPMENT = mongodb://localhost:27017/exampleDB

MONGODB_URI_TESTING = mongodb://localhost:27017/exampleTestDB

# MONGODB_URI_PRODUCTION = Your Production environment MongoDB URI connection string
` : ""}`;

// Create .gitignore file
export const gitignore = (template: string, testing: string) => `# Folders and files to ignore
node_modules/

# Environment files must always be ignored and never commited
.env
${template === "typescript" ? "build/" : ""}
${testing ? "coverage/" : ""}`;

