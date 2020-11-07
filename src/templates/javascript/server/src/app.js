const express = require("express");
const loaders = require("./loaders/index");
const config = require("./config/index");

function startServer() {
    // Initialize the express app
    const app = express();

    // Send the app to the loaders
    loaders(app);

    // Connect the app to the server
    app.listen(config.PORT, () => console.log(`Server is running on ${config.PORT}.`));

    // Throw an error for every unhandled rejection - delegating it to the errorHandling middleware
    process.on("unhandledRejection", err => {
        throw err;
    });
};

startServer();