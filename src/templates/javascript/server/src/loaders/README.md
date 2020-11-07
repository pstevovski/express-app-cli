## Loaders

The idea here is to use **loaders** to split the start up process of your NodeJS / Express application, into modules that are easier to read, understand and test.

Instead of putting everything in the main entry point of the application (e.g. app.js), we split that into separate modules, each one of them responsible for **loading** a specific part of the application, which we then combine and use them for our application, like for example connecting to your database. 

Example of a database connection loader when using MongoDB:
```js
const mongoose = require("mongoose");
const config = require("../config/index");

async function connectMongoose() {
    const { connection } = await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true, 
        useCreateIndex: true, 
        useUnifiedTopology: true
    });
    return connection.db;
};

module.exports = connectMongoose;

// Then we import it and use it in our loaders (loaders/index.js)

async function loader(app) {
    // ... after loading the expressApp 

    await connectMongoose();
    console.log("Connected to database.");
};
```