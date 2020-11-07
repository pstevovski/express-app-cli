import mongoose, { Db } from "mongoose";
import config from "../config/index";

async function connectMongoose(): Promise<Db> {
    const { connection } = await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

    return connection.db;
};

export default connectMongoose;