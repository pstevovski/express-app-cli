const expressApp = require("express");
const db = require("../db/index");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.");

    // Establish connection to database
    await db;
    console.log("Connected to database...");
    
    // More loaders can be added here...
};

module.exports = loader;

