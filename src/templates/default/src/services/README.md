## Services

You should never write your bussiness logic in the route controllers (route files).

Write your business logic in the **services** that you create in this folder, so your route controllers will be concise, easy to read and understand, and easy to test.

> **NOTE**: The example is in vanilla JavaScript. If you're using TypeScript, you probably already know what to do :)

Example:
```js
// An example of a Service for creating new users - UsersService.js
// This example makes use of MongoDB and Mongoose

class Users {
    public async getUsers() {
        const users = await UserModel.find({});

        return users;
    }
}

const UsersService = new Users();

module.exports = UsersService;

// Then we can use it in our Users route (api/routes/users.js)
route.get("/users", async(req, res) => {
    const users = await UsersService.getUsers();

    if (!users || users.length === 0) return res.status(404).json({ status: 404, error: "No users found!" });
    
    res.status(200).json({ status: 200, data: users });
})
```