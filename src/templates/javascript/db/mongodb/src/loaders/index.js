const expressApp = require("./express");
const connectMongoose = require("./mongoose");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.");

    // Establish connection to database
    await connectMongoose();
    console.log("Connected to Mongoose.");

    // More loaders can be added here...
};

module.exports = loader;

