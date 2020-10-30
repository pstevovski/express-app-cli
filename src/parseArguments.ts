import arg from "arg";
import path from "path";
import IParseArguments from "./interfaces/IParseArguments";

function parseArguments(args: string[]): IParseArguments {
  // Get the arguments passed from the user
  const parsedArgs = arg(
    {
      "--git": Boolean,
      "-g": "--git",
    },
    { argv: args.slice(2) },
  );

  // Format the full path to the project directory
  let fullPath: string = "";

  switch (true) {
    // If the user does not pass a path as an argument, default to the current working directory
    case !parsedArgs._[0] || parsedArgs._[0] === ".":
      fullPath = process.cwd();
      break;
    // If the passed directory path is absolute, normalize it removing any extra characters
    case path.isAbsolute(parsedArgs._[0]):
      fullPath = path.normalize(parsedArgs._[0]);
      break;
    // If the passed directory path is a relative path, merge the current working directory and the argument representing the path
    case !path.isAbsolute(parsedArgs._[0]):
      fullPath = path.join(process.cwd(), parsedArgs._[0]);
      break;
  }

  return {
    projectDirectory: fullPath,
    git: parsedArgs["--git"] || false,
    template: parsedArgs._[1],
  };
}

export default parseArguments;
