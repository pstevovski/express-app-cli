import ncp from "ncp";
import { promisify } from "util";
import path from "path";
import fs from "fs";

import { gitignore } from "../templates/files/gitignore";
import { env } from "../templates/files/env";
import MessagesHandler from "./messages";

// Interfaces
import { ProjectDirectories } from "../interfaces/IProject";
import { ProjectArguments } from "../interfaces/IArguments";

// Convert methods in async/await format
const ncpCopy = promisify(ncp);
const access = promisify(fs.access);
const stat = promisify(fs.stat);

class Project {
  private _currentFileURL = __dirname;

  // Trigger creating the project if 'package.json' file doesn't exist in selected directory
  public async create(details: ProjectArguments, directory: string) {
    const fileExists: boolean = await this.checkSelectedDirectory(directory);

    if (fileExists) {
      MessagesHandler.error("package.json already exists in this folder !");
    } else {
      await this.copyFiles(details, directory);
      await this.createFiles(details, directory);
    }
  }

  // Checks the selected directory for a package.json - if it exists, it exits the application
  private async checkSelectedDirectory(directory: string): Promise<boolean> {
    try {
      await stat(`${directory}\\package.json`);

      return true;
    } catch (err) {
      return false;
    }
  }

  // Copy project files
  private async copyFiles(details: ProjectArguments, directory: string): Promise<void> {
    const { language, database, testLibrary, orm, templatingEngine } = details;

    // If selected template is Javascript, don't copy .ts files. Otherwise, don't copy .js files.
    const fileExtensionFilter: string = language === "javascript" ? ".ts" : ".js";

    // Get the paths to the template files
    const { mainFiles, dbFiles, defaultFiles, defaultSQL, config } = this.getTemplateDirectory(language, database, orm);

    try {
      await access(defaultFiles, fs.constants.R_OK);
      await access(mainFiles, fs.constants.R_OK);
      await access(dbFiles, fs.constants.R_OK);
      await access(config, fs.constants.R_OK);

      // Copy files from the default files template
      await ncpCopy(defaultFiles, directory, {
        clobber: false,
        filter: (source: string) => {
          // If testing is selected, copy everything from default folder.
          // Otherwise, copy everything from the default folder EXCEPT the "tests" folder
          return testLibrary ? true : source.endsWith("tests") ? false : true;
        },
      });

      // Copy files recursively from default SQL databases folder
      if (database !== "mongodb") await ncpCopy(defaultSQL, directory, { clobber: false });

      // Copy files recursively from main template directory to targeted directory and DO NOT overwrite
      await ncpCopy(mainFiles, directory, { clobber: false });

      // Copy files recursively from db template directory to targeted directory and ALLOW overwrite
      await ncpCopy(dbFiles, `${directory}/`, {
        clobber: true,
        filter: (file: string): boolean => {
          if (fs.lstatSync(file).isDirectory()) {
            // Copy all database related folders
            return true;
          } else {
            // Copy only files matching the extension filter
            return file.endsWith(fileExtensionFilter) ? false : true;
          }
        },
      });

      // Copy files from the configs templates directory
      await ncpCopy(config, `${directory}/src/config`, {
        clobber: true,
        filter: (file: string): boolean => (file.endsWith(fileExtensionFilter) ? false : true),
      });

      // Write to src/loaders/express file if user has selected a tempalting language
      if (templatingEngine) {
        // Create a views folder
        const viewsDirectoryPath: string = `${directory}/views`;
        fs.mkdirSync(viewsDirectoryPath);

        // Append the Express code for handling the templating engine and views
        this.appendTemplatingEngine(directory, language, templatingEngine);
      }

      // Add a "test" command to the package.json file if a testing library was selected
      if (testLibrary) this.setTestingCommand(directory, testLibrary);
    } catch (err) {
      MessagesHandler.error(err.message);
    }
  }

  private getTemplateDirectory(language: string, database: string, orm: string): ProjectDirectories {
    const pathname: string = new URL(this._currentFileURL).pathname;
    const pathToTemplates: string = "../../src/templates";

    // Copy the main files from the javascript/typescript template folders
    const mainFiles: string = path.resolve(pathname, `${pathToTemplates}/${language}/server`);

    // Copy default files and include tests folder if user selected testing option
    const defaultFiles: string = path.resolve(pathname, `${pathToTemplates}/default`);

    // Copy default files and folders from the SQL databases folder
    const defaultSQL: string = path.resolve(pathname, `${pathToTemplates}/db/sql/default`);

    // Copy config file from
    const configFileType: string = database === "mongodb" ? "mongodb" : "sql";
    const config: string = path.resolve(pathname, `${pathToTemplates}/files/configs/${configFileType}`);

    // Copy the database files
    let dbFiles: string = "";
    switch (true) {
      case (orm && orm === "sequelize") || (orm && orm === "typeorm"):
        dbFiles = path.resolve(pathname, `${pathToTemplates}/db/sql/orm/${orm}`);
        break;
      case !orm && database !== "mongodb":
        dbFiles = path.resolve(pathname, `${pathToTemplates}/db/sql/${database}`);
        break;
      case database === "mongodb":
        dbFiles = path.resolve(pathname, `${pathToTemplates}/db/${database}`);
        break;
    }

    return { mainFiles, dbFiles, defaultFiles, defaultSQL, config };
  }

  // Create .env and .gitignore files
  private async createFiles(details: ProjectArguments, directory: string) {
    const { language, database, testLibrary, orm }: ProjectArguments = details;

    // Create the .env file if an ORM was selected, otherwise use the predefined one
    if (orm) await this.createENVFile(database, directory);

    // Create the .gitignore f ile
    await this.createGitignoreFile(language, directory, testLibrary);
  }

  // Creates a custom .ENV file if the selected database is of SQL type
  private createENVFile(database: string, directory: string): void {
    const envPath: string = `${directory}/.env`;
    const envContent: string = env(database);

    fs.writeFileSync(envPath, envContent);
  }

  // Creates the .gitignore file that marks which files and folders to be ignored by Git
  private createGitignoreFile(language: string, directory: string, testLibrary?: string): void {
    const gitignorePath: string = `${directory}/.gitignore`;
    const gitignoreContent: string = gitignore(language, testLibrary);

    fs.writeFileSync(gitignorePath, gitignoreContent);
  }

  // Append the selected View (Templating) engine if selected by user
  private appendTemplatingEngine(directory: string, language: string, templatingEngine: string): void {
    const tempalteShorthand: string = language === "javascript" ? "js" : "ts";
    const expressFilePath: string = `${directory}/src/loaders/express.${tempalteShorthand}`;

    try {
      const expressFile: Buffer = fs.readFileSync(expressFilePath);
      const fileLinesArray: string[] = expressFile.toString().split("\n");

      // Code to be appended
      const templatingEngineArray: string[] = [
        "    // Selected templating engine",
        `    app.set("view engine", "${templatingEngine}");`,
        `    app.set("views", "./views");`,
        " ",
      ];

      // Append the templating engine strings at the 46th row in the 'express' loader file
      fileLinesArray.splice(46, 0, ...templatingEngineArray);

      // Insert the text
      const updatedExpressFile: string = fileLinesArray.join("\n");

      fs.writeFileSync(expressFilePath, updatedExpressFile);
    } catch (err) {
      MessagesHandler.error(err.message);
    }
  }

  // Sets a test command if a testing library is to be included in the project
  private setTestingCommand(directory: string, testLibrary: string): void {
    // Get the package.json file
    const packageJSON = require(`${directory}/package.json`);

    // Add the test command
    switch (true) {
      case testLibrary === "jest":
        packageJSON.scripts.test = "jest --watchAll --verbose";
        break;
      case testLibrary === "mocha":
        packageJSON.scripts.test = "mocha --watch";
        break;
      case testLibrary === "chai":
        packageJSON.scripts.test = "chai";
        break;
    }

    // Update the package.json file
    fs.writeFileSync(`${directory}/package.json`, JSON.stringify(packageJSON));
  }
}

const ProjectHandler = new Project();

export default ProjectHandler;
