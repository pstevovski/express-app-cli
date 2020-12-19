// Create ENV file based on selected SQL database and ORM
export const env = (db: string, orm: string) => `# YOU SHOULD NEVER COMMIT THIS FILE TO YOUR REPOSITORY.

# Port on which the server will run
PORT = 3000

# DB connection details

# Development
DB_DEVELOPMENT = example_db
DB_USER_DEVELOPMENT = example_user
DB_PASSWORD_DEVELOPMENT = 
DB_HOST_DEVELOPMENT = localhost
${orm ? 
orm === "sequelize" ? `DB_DIALECT = ${db}` :
orm === "typeorm" ? `DB_TYPE = ${db}` : "" :
`DB_PORT = ${db === "postgres" ? "5432" : "3306"}`}

# Testing
DB_TESTING = example_test_db
DB_USER_TESTING = example_test_user
DB_PASSWORD_TESTING = 
DB_HOST_TESTING = localhost

# Production
# DB_PRODUCTION = example_prod_db
# DB_USER_PRODUCTION = example_prod_user
# DB_PASSWORD_PRODUCTION =
# DB_HOST_PRODUCTION =
`;
