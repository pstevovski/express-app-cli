import { Application } from "express";
import expressApp from "./express";

async function loader(app: Application): Promise<void> {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started...");

    // More loaders can be added here...
};

export default loader;