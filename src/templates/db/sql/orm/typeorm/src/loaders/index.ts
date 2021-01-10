import { Application } from "express";
import expressApp from "./express";
import connection from "./typeorm";

async function loader(app: Application): Promise<void> {
  // Establish connection to the express server
  await expressApp(app);
  console.log("Express server started...");

  // Establish connection to database
  try {
    await connection;
    console.log("Connected to database.");
  } catch (err) {
    console.log("Couldn't connect to database.")
    console.log("ERROR: ", err.message);
  }

  // More loaders can be added here...
}

export default loader;
