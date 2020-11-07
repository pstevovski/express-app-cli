import { Application } from "express";
import expressApp from "./express";

async function loader(app: Application): Promise<void> {
    // Establish connection to the server
    await expressApp(app);
    console.log("Express server started...");

    // Other loaders to here.
    // IMPORTANT: All other loaders must come AFTER the expressApp loader has completed starting the server
}