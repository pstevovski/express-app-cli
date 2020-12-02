require("reflect-metadata");

const typeorm = require("typeorm");
const EntitySchema = typeorm.EntitySchema;
const ExampleEntity = require("../db/entities/ExampleEntity");

const db = async() => {
    try {
        await typeorm.createConnection({
            type: DB_TYPE,
            host: DB_HOST,
            port: DB_PORT,
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB,

            // Your entities here
            entities: [ new EntitySchema(ExampleEntity) ],
            synchronize: true,
            logging: false
        });
    } catch (err) {
        console.log("ERROR: ", err.message);
    };
};

module.exports = db;