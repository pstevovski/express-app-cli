import arg from "arg";
import path from "path";
import { IArgumentsMapped, ParseArguments } from "../interfaces/IArguments";
import MessagesHandler from "./messages";

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
          "--pg": "--postgres"
        },
        { argv: args.slice(2) },
      );

      // Handle Help and Version arguments
      if (args.includes("--help") || args.includes("--h")) MessagesHandler.help();
      if (args.includes("--version") || args.includes("--v")) MessagesHandler.version();

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
      MessagesHandler.error(err.message);
    }

  };

  // Map arguments to respective values
  private mapArguments(args: any): IArgumentsMapped {
    const DB: string[] = [];
    const LANGUAGE: string[] = [];
    const TESTING_LIBRARY: string[] = [];
    const ORM: string[] = [];
    const ENGINE: string[] = [];
    
    if (args["--default"]) {
      MessagesHandler.info("Creating default project template: JavaScript, MongoDB with Jest testing library.")
      
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
      MessagesHandler.error("Invalid number of arguments provided.");
    }

    // Handle case in which the user tries to use mongodb with some of the ORM's for a SQL database
    if (ORM.length === 1 && DB[0] === "mongodb") {
      MessagesHandler.error("You can't use an ORM for a SQL database, with MongoDB.");
    }

    return { DB, LANGUAGE, TESTING_LIBRARY, ORM, ENGINE };
  }

  // Removes the -- prefix from the passed arguments
  private removeArgumentPrefix(argument: string): string {
    return argument.replace(/(--)/gi, "");
  }

  // Formats the path to the directory where we want the project created
  // NOTE: Maybe move to a separate function / class, outside of ArgumentsHandler ?
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
}

const ArgumentsHandler = new Arguments();

export default ArgumentsHandler;