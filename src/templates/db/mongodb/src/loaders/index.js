const expressApp = require("express");
const connectMongoose = require("./mongoose");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.");

    // Establish connection to database
    try {
        await connectMongoose();
        console.log("Connected to database.");
    } catch (err) {
        console.log("Couldn't connect to database.")
        console.log("ERROR: ", err.message);
    }

    // More loaders can be added here...
};

module.exports = loader;

