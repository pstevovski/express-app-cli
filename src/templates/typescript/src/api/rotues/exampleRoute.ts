import { Request, Response, Router } from "express";

const route = Router();

const exampleRoute = (app: Router) => {
    app.use("/example", route());

    route.get("/", async(req: Request, res: Response) => {
        res.send(`
            <h1>This is an <u>example</u> route!</h1>
            <p>You can delete this route - it just serves as an example.</h1>
        `);
    });
};

export default exampleRoute;