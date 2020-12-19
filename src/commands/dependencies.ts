import { Answers } from "inquirer";

class DependenciesHandler {

    // Handle the production dependencies
    public prodDependencies(answers: Answers): string[] {
        const { db, orm, engine } = answers;
        const dependencies: string[] = [];

        // Handle database scenarios
        switch(db) {
            case "mongodb":
                dependencies.push("mongoose");
                break;
            case "postgres":
                dependencies.push("pg", "pg-hstore");
                break;
            case "mysql":
                dependencies.push("mysql2");
                break;
            case "sqlite":
                dependencies.push("sqlite3");
                break;
            default: 
                dependencies.push("mongoose");
                break;
        }

        // Add ORM dependency if specified by the user
        if (orm) dependencies.push(orm);

        // Add templating engine dependency if specified by the user
        if (engine) dependencies.push(engine);

        console.log("PROD DEPENDENCIES", dependencies);

        return dependencies;
    }

    // Handle the development-only dependencies
    public devDependencies(answers: Answers): string[] {
        const { template, db, testing, orm } = answers;
        const devDependencies: string[] = [];

        // Install types for Mongoose if selected database is MongoDB
        if (template === "typescript" && db === "mongodb") devDependencies.push("@types/mongoose");

        // Install Sequelize's Bluebird and Validator types if Sequelize is being used as ORM
        // NOTE: TypeORM handles its required types by itself - no need to install additional types
        if (template === "typescript" && orm === "sequelize") devDependencies.push("@types/bluebird", "@types/validator");

        // Handle the selected testing library dependencies
        switch(testing) {
            case "jest":
                devDependencies.push("jest");

                // Include typescript related dependencies
                if (template === "typescript") devDependencies.push("@types/jest", "ts-jest");

                break;
            case "chai":
                devDependencies.push("chai");

                // Include typescript related dependencies
                if (template === "typescript") devDependencies.push("@types/chai");

                break;
            case "mocha":
                devDependencies.push("mocha");

                // Include typescript related dependencies
                if (template === "typescript") devDependencies.push("@types/mocha");

                break;
            default: 
                devDependencies.push("jest");
                break;
        }

        console.log("DEV DEPENDENCIES", devDependencies);

        return devDependencies;
    }

}

const Dependencies = new DependenciesHandler();

export default Dependencies;