## Entities

When using TypeORM, an Entity is your **model** decorated by an @Entity decorator. Your database will be created for such models.

Everywhere in TypeORM, you work with **Entities**. With them, you can load/insert/update/remove and perform other operations.

For more info regarding TypeORM check the following link: <a href="https://typeorm.io/#/">TypeORM</a>.

Since the vanilla Javascript and Typescript implementation of handling the entities when using TypeORM is quite different due to the poor **Decorator** support in vanilla  Javascript, both examples of creating the entities are provided below. For more examples visit: <a href="https://github.com/typeorm/typeorm#samples">here</a>.

**ES5 JavaScript:**
```js
// src/db/entities/ExampleEntity.js
module.exports = {
    name: "ExampleEntity",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        }
    }
};

// src/loaders/typeorm.js
const typeorm = require("typeorm");
const EntitySchema = typeorm.EntitySchema;
const exampleEntity = require("../db/entities/ExampleEntity");

typeorm.createConnection({
    //...Connection details,
    entities: [ new EntitySchema(exampleEntity)]
})
```

**TypeScript:**
```ts
import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class ExampleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}

// src/loaders/typeorm.ts
import { createConnection } from "typeorm";
import { ExampleEntity } from "../db/entities/ExampleEntity";

createConnection({
    // ... Connection details,
    entities: [ ExampleEntity ]
});
```