import "reflect-metadata";
import { createConnection } from "typeorm";
import { ExampleEntity } from "../db/entities/ExampleEntity";
import config from "../config/index";

const connection = createConnection({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB,

    // Your entities here
    entities: [ ExampleEntity ],
    synchronize: true,
    logging: false
});

export default connection;