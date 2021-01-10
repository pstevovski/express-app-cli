import path from "path";

const formatPath = (directoryPath: string): string => {
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
};
export default formatPath;
