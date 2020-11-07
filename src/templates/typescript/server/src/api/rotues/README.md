## Your Routes

Here you can define and export your routes. Example:
```js
import { Request, Response, Router } from "express";

const route = Router();

const exampleRoute = (app: Router) => {
    // Make sure the application uses the routes that we'll define below
    // under the specified endpoint
    app.use("/exampleRoute", route());

    route.get("/", async(req: Request, res: Response) => {
        res.send("<h1>Hi there!</h1>");
    });
};

export default exampleRoute;
```