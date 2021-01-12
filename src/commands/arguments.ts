import arg from "arg";

import formatPath from "./formatProjectPath";
import MessagesHandler from "./messages";

// Interfaces
import {
  MappedArguments,
  DatabaseTypes,
  LanguageTypes,
  OrmTypes,
  ParseArguments,
  TemlpatingEngineTypes,
  TestingLibraryTypes,
} from "../interfaces/IArguments";

class Arguments {
  public async parseArguments(args: string[]): Promise<ParseArguments> {
    // Get the arguments from the user
    try {
      const parsedArgs = arg(
        {
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
          "--pg": "--postgres",
        },
        { argv: args.slice(2) },
      );

      // Handle Help and Version arguments
      if (args.includes("--help") || args.includes("--h")) MessagesHandler.help();
      if (args.includes("--version") || args.includes("--v")) MessagesHandler.version();

      // Get the mapped values for the specified arguments
      const { DATABASE, LANGUAGE, TESTING_LIBRARY, ORM, TEMPLATING_ENGINE }: MappedArguments = this.mapArguments(parsedArgs);

      // Formats the path to the directory where we want the project created
      const pathToDirectory: string = formatPath(parsedArgs._[0]);

      return {
        directory: pathToDirectory,
        language: LANGUAGE[0],
        database: DATABASE[0],
        testLibrary: TESTING_LIBRARY[0],
        orm: ORM[0],
        templatingEngine: TEMPLATING_ENGINE[0],
      };
    } catch (err) {
      MessagesHandler.error(err.message);
    }
  }

  // Map arguments to respective values
  private mapArguments(args: arg.Result<any>): MappedArguments {
    const DATABASE: DatabaseTypes[] = [];
    const LANGUAGE: LanguageTypes[] = [];
    const TESTING_LIBRARY: TestingLibraryTypes[] = [];
    const ORM: OrmTypes[] = [];
    const TEMPLATING_ENGINE: TemlpatingEngineTypes[] = [];

    if (args["--default"]) {
      MessagesHandler.info("Creating default project template: JavaScript, MongoDB with Jest testing library.");

      LANGUAGE.push("javascript");
      DATABASE.push("mongodb");
      TESTING_LIBRARY.push("jest");
    } else {
      // Map arguments to an array of their respective values
      for (const [key] of Object.entries(args)) {
        const argument: any = this.removeArgumentPrefix(key);

        switch (true) {
          case ["mongodb", "postgres", "mysql", "sqlite"].includes(argument):
            DATABASE.push(argument);
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
            TEMPLATING_ENGINE.push(argument);
            break;
        }
      }
    }

    // Check if there are more arguments than there should be based on argument category
    if (
      DATABASE.length > 1 ||
      LANGUAGE.length > 1 ||
      TESTING_LIBRARY.length > 1 ||
      ORM.length > 1 ||
      TEMPLATING_ENGINE.length > 1
    ) {
      MessagesHandler.error("Invalid number of arguments provided.");
    }

    // Handle case in which the user tries to use mongodb with some of the ORM's for a SQL database
    if (ORM.length === 1 && DATABASE[0] === "mongodb") {
      MessagesHandler.error("You can't use an ORM for a SQL database, with MongoDB.");
    }

    return { DATABASE, LANGUAGE, TESTING_LIBRARY, ORM, TEMPLATING_ENGINE };
  }

  // Removes the -- prefix from the passed arguments
  private removeArgumentPrefix(argument: string): string {
    return argument.replace(/(--)/gi, "");
  }
}

const ArgumentsHandler = new Arguments();

export default ArgumentsHandler;
