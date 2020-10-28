import arg from "arg";
import path from "path";
import IParseArguments from  "./interfaces/IParseArguments";

function parseArguments(): IParseArguments {
    // Get the arguments passed from the user
    const args = arg(
      {
        "--git": Boolean,
        "-g": "--git",
      },
      { argv: process.argv.slice(2) },
    );
    
    // Format the full path to the project directory
    let fullPath: string = "";
      
    // TODO: Write tests
    switch(true) {
    // If the passed directory path is absolute, normalize it removing any extra characters
      case path.isAbsolute(args._[0]):
        fullPath = path.normalize(args._[0]);
        break;
    // If the passed directory path is not absolute, merge the current working directory and the argument representing the path
      case !path.isAbsolute(args._[0]):
        fullPath = path.join(process.cwd(), args._[0]);
        break;
    // If the path is not absolute and user entered "." set it to current working directory
      case !path.isAbsolute(args._[0]) && args._[0] === ".":
        fullPath = process.cwd();
        break;
      default:
        fullPath = process.cwd();
    }
  
    return {
      projectDirectory: args._[0] ? fullPath : process.cwd(),
      git: args["--git"] || false,
      template: args._[1],
    };
}

export default parseArguments;