import arg from "arg";
import chalk from "chalk";
import path from "path";
import IParseArguments from "../interfaces/IParseArguments";

class Arguments {

  public async parseArguments(args: string[]): Promise<IParseArguments | undefined> {
    // Get the arguments from the user
    const parsedArgs = arg(
      {
        "--db": String,
        "--testing": String,
        "--auth": Boolean,
        "--template": String,
        "--help": Boolean,
        "--version": Boolean,
  
        // Shorthands
        "-h": "--help",
        "-v": "--v"
      },
      { argv: args.slice(2) },
    );

    // Format the path to the targeted directory
    const pathToDirectory: string = await this.formatPath(parsedArgs._[0]); 

    const invalidArguments = {
      ...(parsedArgs["--db"] && { "--db": parsedArgs["--db"] }),
      ...(parsedArgs["--template"] && { "--template": parsedArgs["--template"] }),
      ...(parsedArgs["--testing"] && { "--testing": parsedArgs["--testing"] })
    };

    const errors = await this.handleInvalidArguments(invalidArguments);

    // If there's an error return the message
    if (errors && errors.length > 0) {
      errors.forEach((errorMsg: string) => {
        console.log(chalk.red.bold("ERROR: "), errorMsg)
      });

      console.log();
      console.log(chalk.bold("See --help for more information."));
      console.log();

      return;
    }

    return {
      projectDirectory: pathToDirectory,
      db: parsedArgs["--db"] || "",
      testing: parsedArgs["--testing"] || "",
      auth: parsedArgs["--auth"] || false,
      template: parsedArgs["--template"] || "",
    };

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

  // Handle potential invalid arguments
  private handleInvalidArguments(parsedArguments: Object): string[] {
    const supportedDBs: string[] = ["mongodb", "mysql", "postgresql"];
    const supportedTestingLibraries: string[] = ["jest", "mocha", "chai"];
    const supportedLanguageTemplates: string[] = ["javascript", "typescript"];

    const errors: string[] = [];

    for(const [key, value] of Object.entries(parsedArguments)) {

      switch(true) {
        case key === "--db" && !supportedDBs.includes(value):
          errors.push("Unsupported type of database.");
          break;
        case key === "--testing" && !supportedTestingLibraries.includes(value):
          errors.push("Unsupported type of testing library.");
          break;
        case key === "--template" && !supportedLanguageTemplates.includes(value):
          errors.push("Unsupported language template.");
          break;
      }

    }

    return errors;
  }
}

const ArgumentsHandler = new Arguments();

export default ArgumentsHandler;