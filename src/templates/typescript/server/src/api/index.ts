import { Router } from "express";
import exampleRoute from "./rotues/exampleRoute";

export default () => {
  const app: Router = Router();

  // Pass the app as an argument to the
  // routes that you imported from the routes folder
  exampleRoute(app);

  return app;
};
