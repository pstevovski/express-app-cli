## Middlewares

In this folder you define all the middlewares that will be used throughout your application. Some examples might include:
- authentication
- authorization
- error handling
- validation etc.

You define your middlewares and then export them so they can be used where needed. Example:

```ts
// An example of an authentication middleware in case you implement your own authentication using JWT.

// middlewares/authMiddleware.ts

import jwt from "jwt";
import { Request, Response, NextFunction } from "express";
import config from "../config/index";

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    // Get the token from the authorization header
    const authorizationHeader: string | null = req.headers["authorization"];

    // Grab the value after the Bearer word - we're using a Bearer token here
    const token: string | null = authorizationHeader && authorizationHeader.split(" ")[1];

    // If token does not exist - return error
    if (!token) return res.status(401).json({ status: 401, error: "Access denied. No token provided." });

    // In case token exists, verify it
    jwt.verify(token, config.JWT_ACCESS_TOKEN, (err, user) => {
        // If there is some error with the token - return error
        if (err) return res.status(403).json({ status: 403, error: "Access forbidden. Invalid token provided." });

        // If everything is okay, include the user in the request object
        req.user = user;

        // Call next middleware in line or the route handler function
        next();
    });
};

export default authenticationMiddleware;
```
