const expressApp = require("./express");
const db = require("./typeorm");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.")

    // Establish connection to database
    await db();

    // More loaders can be added here...
};

module.exports = loader;

