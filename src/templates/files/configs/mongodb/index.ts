import dotenv from "dotenv";

// Handle ENV files
dotenv.config();

// Default Config object type
type ConfigMongoDB = {
  PORT: string | number;
  MONGODB_URI: string;
};

// Get the environment in which the server is currently running
const environment: string = (process.env.NODE_ENV ?? "development").toUpperCase();

const config: ConfigMongoDB = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env[`MONGODB_URI_${environment}`] || "mongodb://localhost/exampleDb",
};

export default config;
