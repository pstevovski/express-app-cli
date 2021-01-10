const expressApp = require("./express");
const connection = require("./typeorm");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.")

    // Establish connection to database
    try {
        await connection;
        console.log("Connected to database...");
    } catch(err) {
        console.log("ERROR: ", err.message);
    }

    // More loaders can be added here...
};

module.exports = loader;

