import dotenv from "dotenv";

// Handle ENV files
dotenv.config();

// Default Config object type
type DB_DIALECT = "mysql" | "postgres" | "sqlite" | "mariadb" | "mssql" | undefined;
type ConfigSQL = {
    DB: string;
    PORT: string | number;
    DB_USER: string;
    DB_HOST: string;
    DB_PASSWORD: string;
    DB_DIALECT: DB_DIALECT;
}

// Get the environment in which the server is currently running
const environment: string = (process.env.NODE_ENV ?? "development").toUpperCase();

const config: ConfigSQL = {
    DB: process.env[`DB_${environment}`]!,
    PORT: process.env.PORT!,
    DB_USER: process.env[`DB_USERNAME_${environment}`]!,
    DB_HOST: process.env[`DB_HOST_${environment}`]!,
    DB_PASSWORD: process.env[`DB_PASSWORD_${environment}`]!,
    DB_DIALECT: process.env.DB_DIALECT as DB_DIALECT
}

export default config;