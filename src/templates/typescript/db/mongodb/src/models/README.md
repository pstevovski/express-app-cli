## Models

Here you can define your models representing the documents that you will save to the collections. Each model defined here e.g. Users, represents a Users **collection** in which user-related documents will be stored.

Example:
```js
// models/Users.ts
import mongoose, { Document } from "mongoose";

// If we created an interface for the users for example
import { IUser } from "../interfaces/IUser";

// We define the schema that will be used to create the model
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
});

// We then create our model - We always name our collection name with a capital, singlular version of what we want to represent.
const UserModel = mongoose.model<IUser & Document>("User", usersSchema);

export default UserModel;
```