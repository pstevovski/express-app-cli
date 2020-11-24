## Sequelize models

In this folder, you will place all the models that you have created using Sequelize's **define** or **create** methods.

> **NOTE**: The example is in vanilla JavaScript. If you're using TypeScript, you probably already know what to do :)

Example:
```js
// This is the schema that you define for the model
const { Model, DataTypes } = require("sequelize");
const db = require("../loaders/sequelize");

// models/UserModel.js
const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER
});

module.exports = User;

// When you'd like to create and save to the database, you can call the .create() method
// which is an object that is consisted of the key/value pairs that match the defined schema.

// services/UsersService.js
const User = require("../models/UserModel");

class UsersService {
    public static async createUser(userDetails) {
        const user = await User.create(userDetails); 

        return user;
    }
}
```