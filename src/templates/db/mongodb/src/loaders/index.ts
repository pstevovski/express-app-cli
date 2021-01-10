import { Application } from "express";
import expressApp from "./express";
import connectMongoose from "./mongoose";

async function loader(app: Application): Promise<void> {
  // Establish connection to the server
  await expressApp(app);
  console.log("Express server started...");

  // Connect to mongoose
  await connectMongoose();
  console.log("Connected to Mongoose.");

  // IMPORTANT: All other loaders must come AFTER the expressApp loader has completed starting the server
}

export default loader;
