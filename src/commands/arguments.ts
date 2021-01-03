import arg from "arg";
import chalk from "chalk";
import path from "path";
import { IArgumentsParsed, IArgumentsMapped } from "../interfaces/IArguments";

class Arguments {

  public async parseArguments(args: string[]): Promise<IArgumentsParsed | undefined> {
    // Get the arguments from the user
    try {
      const parsedArgs = arg(
        {
          // "--auth": Boolean,
          "--help": Boolean,
          "--version": Boolean,
          "--default": Boolean,
          
          // language template arguments
          "--javascript": Boolean,
          "--typescript": Boolean,

          // database arguments
          "--mongodb": Boolean,
          "--postgres": Boolean,
          "--mysql": Boolean,
          "--sqlite": Boolean,

          // testing arguments
          "--jest": Boolean,
          "--mocha": Boolean,
          "--chai": Boolean,

          // ORM for SQL databases
          "--sequelize": Boolean,
          "--typeorm": Boolean,

          // templating engines
          "--handlebars": Boolean,
          "--pug": Boolean,
          "--ejs": Boolean,

          // Shorthands
          "--h": "--help",
          "--v": "--version",
          "--js": "--javascript",
          "--ts": "--typescript",
          "--hbs": "--handlebars",
          "--pg": "--postgres"
        },
        { argv: args.slice(2) },
      );

      // Handle Help and Version arguments
      if (args.includes("--help") || args.includes("--h")) this.handleHelp();
      if (args.includes("--version") || args.includes("--v")) this.handleVersion();

      const { DB, LANGUAGE, TESTING_LIBRARY, ORM, ENGINE }: IArgumentsMapped = await this.mapArguments(parsedArgs);

      // Format the path to the targeted directory
      const pathToDirectory: string = await this.formatPath(parsedArgs._[0]); 

      return {
        projectDirectory: pathToDirectory,
        template: LANGUAGE[0],
        db: DB[0],
        testing: TESTING_LIBRARY[0],
        orm: ORM[0],
        engine: ENGINE[0]
      };
    } catch(err) {
      this.handleErrors(err.message);
    }

  };

  // Map arguments to respective values
  private mapArguments(args: any): IArgumentsMapped {
    const DB: string[] = [];
    const LANGUAGE: string[] = [];
    const TESTING_LIBRARY: string[] = [];
    const ORM: string[] = [];
    const ENGINE: string[] = [];
    
    // If default argument is selected - add default values :)
    if (args["--default"]) {
      console.log();
      console.log(chalk.bold("Creating default project template: JavaScript, MongoDB with Jest testing library."));
      console.log();
      
      LANGUAGE.push("javascript");
      DB.push("mongodb");
      TESTING_LIBRARY.push("jest");
    } else {

      // Map arguments to an array of their respective values
      for(const [key] of Object.entries(args)) {
        const argument = this.removeArgumentPrefix(key);

        switch(true) {
          case ["mongodb", "postgres", "mysql", "sqlite"].includes(argument):
            DB.push(argument);
            break;
          case ["javascript", "typescript"].includes(argument):
            LANGUAGE.push(argument);
            break;
          case ["jest", "mocha", "chai"].includes(argument):
            TESTING_LIBRARY.push(argument);
            break;
          case ["sequelize", "typeorm"].includes(argument):
            ORM.push(argument);
            break;
          case ["handlebars", "ejs", "pug"].includes(argument):
            ENGINE.push(argument);
            break;
        }
      }
    };

    // Check if there are more arguments than there should be based on argument category
    if (DB.length > 1 || LANGUAGE.length > 1 || TESTING_LIBRARY.length > 1 || ORM.length > 1 || ENGINE.length > 1) {
      this.handleErrors("Invalid number of arguments provided.");
    }

    // Handle case in which the user tries to use mongodb with some of the ORM's for a SQL database
    if (ORM.length === 1 && DB[0] === "mongodb") {
      this.handleErrors("You can't use an ORM for a SQL database, with MongoDB.");
    }

    return { DB, LANGUAGE, TESTING_LIBRARY, ORM, ENGINE };
  }

  // Removes the -- prefix from the passed arguments
  private removeArgumentPrefix(argument: string): string {
    return argument.replace(/(--)/gi, "");
  }

  // Formats the path to the directory where we want the project created
  private async formatPath(directoryPath: string): Promise<string> {
    let fullPath: string = "";

    switch (true) {
      // If the user does not pass a path as an argument, default to the current working directory
      case !directoryPath || directoryPath === ".":
        fullPath = process.cwd();
        break;
      // If the passed directory path is absolute, normalize it removing any extra characters
      case path.isAbsolute(directoryPath):
        fullPath = path.normalize(directoryPath);
        break;
      // If the passed directory path is a relative path, merge the current working directory and the argument representing the path
      case !path.isAbsolute(directoryPath):
        fullPath = path.join(process.cwd(), directoryPath);
        break;
    }

    return fullPath;
  }

  // Handle Help argument's message
  private handleHelp(): void {
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

    process.exit(0);
  }

  // Display current version of the application
  private handleVersion(): void {
    const packageJSON = require("../../package.json");
    
    console.log();
    console.log(`v${packageJSON.version}`);

    process.exit(0);
  }

  // Handle potential errors
  private handleErrors(errorMessage: string): void {
    console.log(chalk.red.bold("ERROR:"), errorMessage);
    console.log();
    console.log(chalk.bold("See --help for more information."));
    console.log();
    console.log(chalk.bgBlue.white.bold("Exiting application..."));

    process.exit(1);
  }
}

const ArgumentsHandler = new Arguments();

export default ArgumentsHandler;