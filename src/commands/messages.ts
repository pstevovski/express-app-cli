import chalk from "chalk";

class Messages {
    // Display error messages
    public error(message: string): void {
        console.log();
        console.log(chalk.red.bold("❌ ERROR:"), message);
        console.log();
        console.log(chalk.bold("See --help for more information."));
        console.log();

        // Exit the application with an error
        process.exit(1);
    }

    // Display success related messages
    public success(message: string): void {
        console.log("");
        console.log(chalk.green.bold("✅ DONE "), message);
        console.log("");

        // Exit the application without error
        process.exit(0);
    }

    // Display informataive messages
    public info(message: string): void {
        console.log();
        console.log(chalk.blueBright.bold("INFO: "),  message);
        console.log();
    };

    // Display Help related information
    public help(): void {
        console.log();
        console.log(`${chalk.bold("express-app CLI")} is used for fast bootstrapping your NodeJS / Express project.`);
        console.log();
        console.log(`This CLI provides multiple options to customize your project such as:
        - language template
        - database 
        - testing library,
        - ORM (if using a SQL database) 
        - selecting a templating engine.`
        );
        console.log();
        console.log(`It provides the following arguments to be used by the user:

        ${chalk.bold("Languages")}:
        --javascript OR --js -> selects Javascript as a language
        --typescript OR --ts -> selects Typescript as used language
        
        ${chalk.bold("Databases")}:
        --mongodb -> selects MongoDB and Mongoose database and driver
        --postgres OR --pg -> selects Postgres database
        --mysql   -> selects MySQL database
        --sqlite  -> selects SQLite database

        ${chalk.bold("Testing libraries")}:
        --jest  -> Selects Jest testing library
        --chai  -> Selects Chai testing library
        --mocha -> Selects Mocha testing library

        ${chalk.bold("ORM's if a SQL database is selected")}:
        --sequelize -> Selects Sequelize ORM
        --typeorm   -> Selects TypeORM 

        ${chalk.bold("Templating Engines")}:
        --handlebars OR --hbs -> Selects Handlebars templating engine
        --ejs -> Selects EJS templating engine
        --pug -> Selects Pug templating engine

        ${chalk.bold("Misc")}:
        --version OR --v -> Provides the version of the application
        --help OR --h -> Provides the information regarding the application

        `);
        console.log();
        console.log("If used without passing ALL or SPECIFIC arguments, the user will be prompted to answer questions regarding the project.");
        console.log();
        console.log(`You can also make use of the ${chalk.bold("--default")} argument that will create a project using:
        - Javascript
        - MongoDB
        - Jest testing library
        `);

        // Exit the application without error
        process.exit(0);
    };

    // Display CLI Version related information
    public version(): void {
        const packageJSON = require("../../package.json");
    
        console.log();
        console.log(`v${packageJSON.version}`);
    
        // Exit the application without error
        process.exit(0);
    }
}

const MessagesHandler = new Messages();

export default MessagesHandler;