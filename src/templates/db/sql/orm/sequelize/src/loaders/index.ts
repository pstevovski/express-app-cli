import { Application } from "express";
import expressApp from "./express";
import db from "./sequelize";

async function loader(app: Application): Promise<void> {
  // Establish connection to the express server
  await expressApp(app);
  console.log("Express server started...");

  // Establish connection to database
  try {
    await db.authenticate();

    console.log("Database connected...");
  } catch (err) {
    console.log("ERROR: ", err);
  }

  // More loaders can be added here...
}

export default loader;
