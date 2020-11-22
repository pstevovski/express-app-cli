import ncp from "ncp";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import fse from "fs-extra";

import { config_js, config_ts } from "../templates/files/config";
import { gitignore } from "../templates/files/gitignore";

// Interfaces
import { IProjectConfigTemplates, IProjectCreate, ITemplateDirectories } from "../interfaces/IProject";

const copy = promisify(ncp);
const access = promisify(fs.access);
const stat = promisify(fs.stat);

class ProjectTemplate {
    private _currentFileURL = __dirname;

    public async create(details: IProjectCreate, directory: string) {
        const fileExists: boolean = await this.checkSelectedDirectory(directory);

        if (fileExists) {
            // TODO: Make an error handling class and move every error handling function there 
            console.log();
            console.log(chalk.red.bold("ERROR: "), "package.json already exists in this folder !");
            console.log();

            process.exit(1);
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
        } catch(err) {
            return false;
        }
    }
    
    // Copy main template project files
    private async copyFiles(details: IProjectCreate, directory: string): Promise<void> {
        const { template, db, testing } = details;

        console.log(chalk.blueBright.bold("Creating project directory..."));

        const { main_files, dbFiles, default_files } = this.getTemplateDirectory(template, db);

        try {
            await access(default_files, fs.constants.R_OK);
            await access(main_files, fs.constants.R_OK);
            await access(dbFiles, fs.constants.R_OK);
            
            // TODO: Replace ncp (copy in this case) with fse.copy()
            // Copy files from the default files template
            await copy(default_files, directory, { 
                clobber: false,
                filter: testing ? undefined : RegExp('tests')
            });

            // if auth is selected:
            // - copy api/routes/login
            // - copy middlewares/authentication
            // - copy middlewares/authorization
            // - copy .env file that includes JWT secrets
            // - copy api/routes/users
            // - copy services/UserService
            // - copy config/index
            // add bcrypt, jsonwebtoken as NPM dependencies to be installed

            // const authToCopy = template === "javascript" ? RegExp()
            // filter: include_auth ? undefined : template === "javascript" ? 

            // Copy files recursively from main template directory to targeted directory and DO NOT overwrite
            // await copy(main_files, directory, { clobber: false });
            await fse.copy(main_files, directory, { overwrite: false });

            // Copy files recursively from db template directory to targeted directory and ALLOW overwrite
            await fse.copy(dbFiles, `${directory}/`, {
                overwrite: true,
                filter: async(file: string): Promise<boolean> => {
                    if (template.toLowerCase() === "javascript") {
                        return (await fse.stat(file)).isDirectory() || file.endsWith(".js") || file.endsWith(".md") || file.endsWith(".env");
                    } else {
                        return (await fse.stat(file)).isDirectory() || file.endsWith(".ts") || file.endsWith(".md") || file.endsWith(".env");
                    }
                }}
            );
            

            return console.log(chalk.blueBright.bold("Files copied."));

        } catch (err) {
            console.error(chalk.red.bold("ERROR: "), `${err.message}`);

            // Exit the application with an error
            process.exit(1);
        }
    };

    private getTemplateDirectory(template: string, db: string): ITemplateDirectories {
        const pathname: string = new URL(this._currentFileURL).pathname;
        const pathToTemplates: string = "../../src/templates";

        const main_files: string = path.resolve(pathname, `${pathToTemplates}/${template.toLowerCase()}/server`);

        const dbFiles: string = path.resolve(pathname, `${pathToTemplates}/db/${db.toLowerCase()}`);

        // Copy default files and include tests folder if user selected testing option
        const default_files: string = path.resolve(pathname, `${pathToTemplates}/default`);

        return { main_files, dbFiles, default_files };
    }

    // Create config/index, .env and .gitignore files
    private async createFiles(details: IProjectCreate, directory: string) {
        let { template, db, testing }: IProjectCreate = details;

        // Convert details to lowercase
        template = template.toLowerCase();
        db = db.toLowerCase();
        testing = testing.toLowerCase();

        // Create and write each file
        await this.createConfigFile(template, db, directory);
        // await this.createENVFile(db, directory);
        await this.createGitignoreFile(template, testing, directory);
    };

    // Creates the configuration file
    private createConfigFile(template: string, db: string, directory: string): void {
        const file_path: string = `${directory}/src/config/index${template.toLowerCase() === 'javascript' ? '.js' : '.ts'}`;

        // Config file content
        const config_details: IProjectConfigTemplates = { template, db };
        let config_content: string = "";

        // Load configuration file content based on selected details
        switch(template.toLowerCase()) {
            case "javascript":
                config_content = config_js(config_details);
                break;
            case "typescript":
                config_content = config_ts(config_details);
                break;
        }

        // Create and write in the configuration file
        fs.writeFileSync(file_path, config_content);
    };

    // Creates the .gitignore file that marks which files and folders to be ignored by Git
    private createGitignoreFile(template: string, testing: string, directory: string): void {
        const gitignore_path: string = `${directory}/.gitignore`;
        const gitignore_content: string = gitignore(template, testing );

        fs.writeFileSync(gitignore_path, gitignore_content);
    }
}

const Project = new ProjectTemplate();

export default Project;