## Controllers

If you want to follow the MVC pattern, you can create your controllers in this directory, and then export them and use them in the routes where needed.

You are not **obliged** to use the MVC pattern.

The key thing to remember when using NodeJS & Express is that it **does not enforces any strict structure and opinions** on how to structure your project, which can be both an upside and a downside.

> **NOTE**: The example is in vanilla JavaScript. If you're using TypeScript, you probably already know what to do :)

Example:
```js
// controlers/UsersController.js
const UsersService = require("../services/UserService");

class Users {
    public async getUsers(req, res, next) {
        const users = await UsersService.getUsers();
        
        if (!users || users.length === 0) return res.status(404).json({ status: 404, error: "No users found." });

        res.status(200).json({ status: 200, data: users });
    }
}

const UsersController = new Users();

module.exports = UsersController;

// api/routes/users.js
const express = require("express");
const UsersController = require("../../controllers/UsersController");

const route = express.Router();

// The *app* parameter here is the server Router sent when we call the route function in our api/index.js file
const usersRoute = app => {
    app.use("/users", route);

    // Define your get, post, delete, update routes here
    route.get("/", UsersController.getUsers);
};
```