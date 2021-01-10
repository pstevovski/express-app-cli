require("reflect-metadata");

const typeorm = require("typeorm");
const EntitySchema = typeorm.EntitySchema;
const ExampleEntity = require("../db/entities/ExampleEntity");
const config = require("../config/index");

const connection = typeorm.createConnection({
    type: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB,

    // Your entities here
    entities: [ new EntitySchema(ExampleEntity) ],
    synchronize: true,
    logging: false
});

module.exports = connection;