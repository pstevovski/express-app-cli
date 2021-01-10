import express from "express";
import config from "./config/index";
import loader from "./loaders/index";

function startServer(): void {
  // Initialize express
  const app: express.Application = express();

  // Send the express app to the loaders
  loader(app);

  // Connect application to the express server
  app.listen(config.PORT, () => console.log(`Server is running on port: ${config.PORT}`));

  // Throw an exception for every unhandled rejection of a promise so it can be handled by errorHandling middleware
  process.on("unhandledRejection", (ex: ErrorEvent) => {
    throw ex;
  });
}

startServer();
