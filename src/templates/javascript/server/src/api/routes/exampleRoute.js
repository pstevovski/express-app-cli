const express = require("express");

const route = express.Router();

// The *app* parameter here is the server Router sent when we call the route function in our api/index.js file
const exampleRoute = app => {
    app.use("/example", route);

    // Define your get, post, delete, update routes here
    route.get("/", async(req, res) => {
        res.send(`
            <h1>This is an <u>example</u> route!</h1>
            <p>You can delete this route - it just serves as an example.</h1>
        `);
    });
};

module.exports = exampleRoute;