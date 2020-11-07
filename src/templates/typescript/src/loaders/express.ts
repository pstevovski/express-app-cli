// Package to automatically handle the errors of our async functions
require("express-async-errors");
import { Application } from "express";
import routes from "../api/index";

// Middlewares
import errorHandlingMiddleware from "../middlewares/errorHandling";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";

// Allowed origins to be used by the CORS middleware - update as you need
const allowedOrigins: string[] = ["http://localhost:3000", "http://localhost:3001"];

const expressApp = (app: Application): void => {
    // Handles a collection of smaller middleware functions that set security-related HTTP response headers
    app.use(helmet());

    // Enables cross-origin resource sharing (CORS) with various options.
    app.use(cors({
        origin: (origin, callback) => {
            // Allow requests with no origin such as mobile apps or CURL requests
            if (!origin) return callback(null, true);

            // Check if current origin is on the list of allowed origins
            if (allowedOrigins.indexOf(origin) === -1) {
                const errorMessage: string = `The CORS policy for this site does not allow access from the following origin: ${origin}.`;
                callback(new Error(errorMessage), false);
            };

            // Allow access if origin is allowed
            return callback(null, true);
        },
        credentials: true
    }));

    // Parse cookie header and populate req.cookies
    app.use(cookieParser());

    // Parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // Parse application/json
    app.use(bodyParser.json());

    // Routes
    app.use("/api", routes());

    // Error handling middleware
    app.use(errorHandlingMiddleware);
};

export default expressApp;