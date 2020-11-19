const express = require("express");

const exampleRoute = require("./routes/exampleRoute");

module.exports = () => {
  const app = express.Router();

  // Import the route functions that you created in the ROUTES folder and call them, with **app** as argument.
  
  // Delete afterwards
  exampleRoute(app);

  return app;
}