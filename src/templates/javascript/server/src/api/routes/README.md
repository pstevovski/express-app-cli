## Your Routes

Here you can define and export your routes. Example:
```js
const express = require("express");

const route = express.Router();

// The *app* parameter here is the server Router sent when we call the route function in our api/index.js file
const someRoute = app => {
    app.use("/endPointOfTheRoute", route);

    // Define your get, post, delete, update routes here
    route.get("/", async(req, res) => {
        res.send("Hello!");
    });
};

module.exports = someRoute;
```