## Middlewares

In this folder you define all the middlewares that will be used throughout your application. Some examples might include:
- authentication
- authorization
- error handling
- validation etc.

You define your middlewares and then export them so they can be used where needed. Example:

```js
// An example of an authentication middleware in case you implement your own authentication using JWT.

const jwt = require("jwt");
const express = require("express");
const config = require("../config/index");

const authenticationMiddleware = (req, res, next) => {
    // Get the token from the authorization header
    const authenticationHeader = req.headers["authorization"];

    // In case of a Bearer token, grab the value after the Bearer word
    const token = authenticationHeader && authenticationHeader.split(" ")[1];

    // If the token does not exist
    if (!token) return res.status(401).json({ status: 401, error: "Access denied. No token provided." });

    // In case token exists, verify it
    jwt.verify(token, config.JWT_ACCESS_TOKEN, (err, user) => {
        // If there is some sort of an error with the token (e.g. expired)
        if (err) return res.status(403).json({ status: 403, error: "Access forbidden. Invalid token provided." });

        // If everything is okay, include the user in the request object
        req.user = user;

        // Call next middleware in line, or the route handler function
        next();
    });
};

module.exports = authenticationMiddleware;
```
