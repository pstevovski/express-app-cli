// Handle all catch blocks from async routes and delegate them to errorHandling middleware
require("express-async-errors");

const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const routes = require("../api/index");
const config = require("../config/index");
const errorHandling = require("../middlewares/errorHandling");

// List of allowed origins so CORS doesn't throw an error - add the ones that you need.
const allowedOrigins = ["http://localhost:3000", "http://localhost:3001"];

function expressApp(app) {
    // Handles a collection of smaller middleware functions that set security-related HTTP response headers
    app.use(helmet());

    // Enables cross-origin resource sharing (CORS) with various options.
    app.use(cors({
        credentials: true,
        origin: function(origin, callback) {
            // Allow requests with no origin (e.g. mobile apps or CURL requests)
            if (!origin) return callback(null, true);

            // Check if the current origin exists in the allowedOrigins array otherwise throw error
            if (allowedOrigins.indexOf(origin) === -1) {
                const errorMessage = `The CORS policy for this site does not allow access from the specified origin: ${origin} .`
                return callback(new Error(errorMessage), false); 
            }

            return callback(null, true);
        }
    }));

    // Parse cookie header and populate req.cookies.
    app.use(cookieParser());

   // Parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // Parse application/json
    app.use(bodyParser.json());

    // Use the defined routes
    app.use("/api", routes());

    // Error handling middleware - always goes last
    app.use(errorHandling);
};

module.exports = expressApp;