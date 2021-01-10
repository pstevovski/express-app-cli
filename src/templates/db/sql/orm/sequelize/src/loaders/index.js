const expressApp = require("./express");
const db = require("./sequelize");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.")

    // Establish connection to database
    try {
        await db.authenticate();

        console.log("Connected to database.");
    } catch(err) {
        console.log("Couldn't connect to database.")
        console.log("ERROR: ", err.message);
    }

    // More loaders can be added here...
};

module.exports = loader;

