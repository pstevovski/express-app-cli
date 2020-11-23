import arg from "arg";
import chalk from "chalk";
import path from "path";
import IParseArguments, { IMapParsedArguments } from "../interfaces/IParseArguments";

class Arguments {

  public async parseArguments(args: string[]): Promise<IParseArguments | undefined> {
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

          // testing arguments
          "--jest": Boolean,
          "--mocha": Boolean,
          "--chai": Boolean,

          // ORM for SQL databases
          "--sequelize": Boolean,
          "--typeorm": Boolean,
          "--prisma": Boolean,

          // Shorthands
          "-h": "--help",
          "-v": "--v",
          "--js": "--javascript",
          "--ts": "--typescript",
        },
        { argv: args.slice(2) },
      );

      const { DB, LANGUAGE, TESTING_LIBRARY, ORM }: IMapParsedArguments = await this.mapArguments(parsedArgs);

      // Format the path to the targeted directory
      const pathToDirectory: string = await this.formatPath(parsedArgs._[0]); 

      return {
        projectDirectory: pathToDirectory,
        db: DB[0],
        testing: TESTING_LIBRARY[0],
        template: LANGUAGE[0],
        orm: ORM[0]
        // auth: parsedArgs["--auth"] || false,
      };
    } catch(err) {
      this.handleErrors(err.message);
    }

  };

  // Map arguments to respective values
  private mapArguments(parsedArgs: any): IMapParsedArguments {
    const DB: string[] = [];
    const LANGUAGE: string[] = [];
    const TESTING_LIBRARY: string[] = [];
    const ORM: string[] = [];
    
    // If default argument is selected - add default values :)
    if (parsedArgs["--default"]) {
      console.log();
      console.log(chalk.bold("Creating default project template: JavaScript, MongoDB with Jest testing library."));
      console.log();
      
      LANGUAGE.push("javascript");
      DB.push("mongodb");
      TESTING_LIBRARY.push("jest");
    } else {

      // Map arguments to an array of their respective values
      for(const [key] of Object.entries(parsedArgs)) {
        switch(key) {
          case "--mongodb":
            DB.push("mongodb");
            break;
          case "--postgres":
            DB.push("postgres");
            break;
          case "--mysql":
            DB.push("mysql");
            break;
          case "--javascript":
            LANGUAGE.push("javascript");
            break;
          case "--typescript":
            LANGUAGE.push("typescript");
            break;
          case "--jest":
            TESTING_LIBRARY.push("jest");
            break;
          case "--mocha":
            TESTING_LIBRARY.push("mocha");
            break;
          case "--chai":
            TESTING_LIBRARY.push("chai");
            break;
          case "--sequelize":
            ORM.push("sequelize");
            break;
          case "--typeorm":
            ORM.push("typeorm");
            break;
          case "--prisma":
            ORM.push("prisma");
            break;
        }
      }

    };

    // Check if there are more arguments than there should be based on argument category
    if (DB.length > 1 || LANGUAGE.length > 1 || TESTING_LIBRARY.length > 1 || ORM.length > 1) {
      this.handleErrors("Invalid number of arguments provided.");
    }

    return { DB, LANGUAGE, TESTING_LIBRARY, ORM };
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