// Create ENV file based on selected SQL database and ORM
export const env = (db: string, orm: string) => `# YOU SHOULD NEVER COMMIT THIS FILE TO YOUR REPOSITORY.

# Port on which the server will run
PORT = 3000;

# DB connection details
DB = example_db
DB_USER = example_uesr
DB_PASSWORD = 
DB_HOST = localhost
${orm ? `DB_DIALECT = ${db}` : ""}
${!orm ? `DB_PORT = ${db === "postgres" ? "5432" : "3306"}` : ""}
`;