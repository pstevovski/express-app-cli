import { Application } from "express";
import expressApp from "./express";
import { connectToDB } from "../db/index";

async function loader(app: Application): Promise<void> {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started...");

    // Establish connection to database
    await connectToDB();

    // More loaders can be added here...
};

export default loader;