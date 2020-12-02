import "reflect-metadata";
import { createConnection } from "typeorm";
import { ExampleEntity } from "../db/entities/ExampleEntity";

const db = async(): Promise<void> => {
    try {
        await createConnection({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,

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