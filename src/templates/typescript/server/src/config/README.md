## .env configuration

Here you setup how your server will handle the **.env** files, based on the environment in which your server is running.

Using the **dotenv** package, your server will be able to read the values defined in the .env file and use them.

You add properties into the exported object, following the key/value format, where:
- **key** is the name that will be used to access the specified <u>environment variable (ENV)</u>
- **value** is the value retrieved from the .env file.

Example:
```js
module.exports = {
    PORT: process.env.PORT || 3000,
}
```