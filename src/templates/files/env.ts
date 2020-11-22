// Append to .env file based on selected options (database, auth, etc.)
export const env = (options: any) => `# You should NEVER commit this file.

# PORT on which the server will run
PORT = 3000;

${options.db === "mongodb" ? `
# MONGO DB Connection string
MONGODB_URI_DEVELOPMENT = mongodb://localhost:27017/exampleDB

MONGODB_URI_TESTING = mongodb://localhost:27017/exampleTestDB

# MONGODB_URI_PRODUCTION = Your Production environment MongoDB URI connection string
` : ""}

${options.db === "postgresql" || options.db === "mysql" ? `
# ${options.db.toUpperCase()} Connection details

DB = example_db
DB_USER = example_user
DB_PASSWORD = 
DB_HOST = localhost
DB_PORT = ${options.db === "postgresql" ? "5432" : "3306"},
` : ""}`;