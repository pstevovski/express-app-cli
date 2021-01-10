const expressApp = require("./express");

async function loader(app) {
    // Establish connection to the express server
    await expressApp(app);
    console.log("Express server started.")

    // More loaders can be added here...
};

module.exports = loader;

