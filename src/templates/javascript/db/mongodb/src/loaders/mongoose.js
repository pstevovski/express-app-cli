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