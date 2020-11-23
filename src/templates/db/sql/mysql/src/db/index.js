const mysql = require('mysql');
const config = require("../config/index");

const connection = mysql.createConnection({
  database: config.DB,
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  port: config.DB_PORT
});
 
const connectToDB = () => connection.connect((err) => {
  if (err) throw err;

  console.log(`MySQL is ${connection.state}`);
});

const query = (text, params) => connection.query(text, params, (error, results, fields) => {
  if (error) throw error;

  console.log("Some example results", results[0].solution);
});

module.exports = {
  connectToDB,
  query
};