import "reflect-metadata";
import { createConnection } from "typeorm";
import { ExampleEntity } from "../db/entities/ExampleEntity";
import config from "../config/index";

const db = async(): Promise<void> => {
    try {
        await createConnection({
            type: config.DB_TYPE,
            host: config.DB_HOST,
            port: config.DB_PORT,
            username: config.DB_USERNAME,
            password: config.DB_PASSWORD,
            database: config.DB,

            // Your entities here
            entities: [ ExampleEntity ],
            synchronize: true,
            logging: false
        });
    } catch (err) {
        console.log("ERROR: ", err.message);
    };
};

export default db;