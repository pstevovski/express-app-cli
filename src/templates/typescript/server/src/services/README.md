## Services

You should never write your bussiness logic in the route controllers (route files).

Write your business logic in the **services** that you create in this folder, so your route controllers will be concise, easy to read and understand, and easy to test.

Example:
```ts
// An example of a Service for creating new users.
// This example makes use of MongoDB and Mongoose.

// interfaces/IUser.ts
export interface IUser {
    name: string;
    age: number;
};

export interface IUserService {
    getUsers:  (): Promise<IUser[] | null>
};

// services/UsersService.ts
import UserModel from "../models/UserModel";
import { IUser, IUserService } from "../interfaces/IUser";

class Users implements IUserService {
    public async getUsers(): Promise<IUser[] | null> {
        const users = await UserModel.find({});

        return users;
    }
}

const UsersService = new Users();

export default UsersService;

// api/routes/users.ts
route.get("/users", async(req, res) => {
    const users: IUser[] | null = await UsersService.getUsers();

    if (!users || users.length === 0) return res.status(404).json({ status: 404, error: "No users found!" });
    
    res.status(200).json({ status: 200, data: users });
})
```