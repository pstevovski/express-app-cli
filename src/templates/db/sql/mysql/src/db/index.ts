import mysql from "mysql2";
import config from "../config/index";

const connection = mysql.createConnection({
  database: config.DB,
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  port: config.DB_PORT
});
 
export const connectToDB = () => connection.connect((err: Error) => {
  if (err) throw err;

  console.log(`MySQL database is ${connection.state}`);
});

export const query = (text: string, params: any) => connection.query(text, params, (error: Error, results: any[], fields: any) => {
  if (error) throw error;

  console.log("Example query results", results[0].solution);
});
