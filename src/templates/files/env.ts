// Create ENV file based on selected SQL database and ORM
export const env = (db: string) => `
# Server Port
PORT = 3000

# DEVELOPMENT ENVIRONMENT
DB_DEVELOPMENT =
DB_PORT_DEVELOPMENT = ${db === "postgres" ? "5432" : "3306"}
DB_USERNAME_DEVELOPMENT = ${db === "postgres" ? "postgres" : db === "mysql" ? "root" : ""}
DB_PASSWORD_DEVELOPMENT = 
DB_HOST_DEVELOPMENT = localhost
DB_TYPE = ${db}

# TESTING ENVIRONMENT
DB_TESTING =
DB_PORT_TESTING = ${db === "postgres" ? "5432" : "3306"}
DB_USERNAME_TESTING = ${db === "postgres" ? "postgres" : db === "mysql" ? "root" : ""}
DB_PASSWORD_TESTING = 
DB_HOST_TESTING = localhost
DB_TYPE = ${db}

# PRODUCTION ENVIRONMENT
DB_PRODUCTION =
DB_PORT_PRODUCTION = 
DB_USERNAME_PRODUCTION = 
DB_PASSWORD_PRODUCTION = 
DB_HOST_PRODUCTION = 
DB_TYPE = ${db}
`;
