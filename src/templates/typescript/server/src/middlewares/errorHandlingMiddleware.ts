import { Request, Response, NextFunction } from "express";

const errorHandlingMiddleware = (error: any, req: Request, res: Response, next: NextFunction): void => {
    // By default it logs to the console. If a logger is selected as extra dependency, change this line
    console.log("ERROR: ", error);

    // Send 500 error as a response
    res.status(500).json({ status: 500, error: "Something went wrong!" });
};

export default errorHandlingMiddleware;