import ncp from "ncp";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import fse from "fs-extra";

import { config_js, config_ts } from "../templates/files/config";
import { gitignore } from "../templates/files/gitignore";
import { env } from "../templates/files/env";

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
            // TODO: Make an error handling utility function 
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
        let { template, db, testing, orm, engine } = details;

        // Convert to lowercase - TODO: Refactor, converting to lowercase is present on 2 places atm
        template = template.toLowerCase();
        db = db.toLowerCase();

        if (orm) orm = orm.toLowerCase();
        if (engine) engine = engine.toLowerCase();

        const { main_files, dbFiles, default_files, defaultSQL } = this.getTemplateDirectory(template, db, orm);

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

            // Copy files recursively from default SQL databases folder
            await fse.copy(defaultSQL, directory, { overwrite: false });

            // Copy files recursively from main template directory to targeted directory and DO NOT overwrite
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

            // Write to src/loaders/express file if user has selected a tempalting language
            if (engine) {
                // Create a views folder
                const viewsDirectoryPath: string = `${directory}/views`;
                fs.mkdirSync(viewsDirectoryPath);

                // Append the Express code for handling the templating engine and views 
                this.appendTemplatingEngine(directory, template, engine);
            }
            
        } catch (err) {
            // TODO: Move to a error handling utility function
            console.error(chalk.red.bold("ERROR: "), `${err.message}`);

            // Exit the application with an error
            process.exit(1);
        }
    };

    private getTemplateDirectory(template: string, db: string, orm: string | boolean): ITemplateDirectories {
        const pathname: string = new URL(this._currentFileURL).pathname;
        const pathToTemplates: string = "../../src/templates";

        const main_files: string = path.resolve(pathname, `${pathToTemplates}/${template.toLowerCase()}/server`);

        // Copy default files and include tests folder if user selected testing option
        const default_files: string = path.resolve(pathname, `${pathToTemplates}/default`);

        // Copy default files and folders from the SQL databases folder
        const defaultSQL: string = path.resolve(pathname, `${pathToTemplates}/db/sql/default`);  

        let dbFiles: string = "";

        switch(true) {
            case orm && orm === "sequelize" || orm && orm === "typeorm":
                dbFiles = path.resolve(pathname, `${pathToTemplates}/db/sql/orm/${orm}`);
                break;
            case !orm && db !== "mongodb":
                dbFiles = path.resolve(pathname, `${pathToTemplates}/db/sql/${db}`);
                break;
            case db === "mongodb":
                dbFiles = path.resolve(pathname, `${pathToTemplates}/db/${db}`);
                break;
        }

        return { main_files, dbFiles, default_files, defaultSQL };
    }

    // Create config/index, .env and .gitignore files
    private async createFiles(details: IProjectCreate, directory: string) {
        let { template, db, testing, orm }: IProjectCreate = details;

        // Convert details to lowercase
        template = template.toLowerCase();
        db = db.toLowerCase();
        
        if (orm) orm = orm.toLowerCase();
        if (testing) testing = testing.toLowerCase();

        // Create and write each file
        await this.createConfigFile(template, db, directory, orm);
        await this.createENVFile(db, orm, directory);
        await this.createGitignoreFile(template, directory, testing);
    };

    // Creates the configuration file
    private createConfigFile(template: string, db: string, directory: string, orm?: string): void {
        const file_path: string = `${directory}/src/config/index${template.toLowerCase() === 'javascript' ? '.js' : '.ts'}`;

        // Config file content
        const config_details: IProjectConfigTemplates = { 
            template, 
            db,
            ...(orm && { orm })
        };
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

    // Creates a custom .ENV file if the selected database is of SQL type
    private createENVFile(db: string, orm: string, directory: string):void {
        const envPath: string = `${directory}/.env`;
        const envContent: string = env(db, orm);

        fs.writeFileSync(envPath, envContent);
    }

    // Creates the .gitignore file that marks which files and folders to be ignored by Git
    private createGitignoreFile(template: string, directory: string, testing?: string): void {
        const gitignore_path: string = `${directory}/.gitignore`;
        const gitignore_content: string = gitignore(template, testing);

        fs.writeFileSync(gitignore_path, gitignore_content);
    }

    // Append the selected View (Templating) engine if selected by user
    private appendTemplatingEngine(directory: string, template: string, engine: string): void {
        const tempalteShorthand: string = template === "javascript" ? "js" : "ts";
        const expressFilePath: string = `${directory}/src/loaders/express.${tempalteShorthand}`;

        try {
            const expressFile: Buffer = fs.readFileSync(expressFilePath);
            const fileLinesArray: string[] = expressFile.toString().split("\n");
            
            // The lines at which it should insert code
            fileLinesArray[46] = "    // Selected templating engine";
            fileLinesArray[47] = `    app.set("view engine", "${engine}")`;
            fileLinesArray[48] = `    app.set("views", "./views")`;
            fileLinesArray[49] = "  ";

            // Insert the text
            const updatedExpressFile: string = fileLinesArray.join("\n");
            
            fs.writeFileSync(expressFilePath, updatedExpressFile);

        } catch (err) {
            // TODO: Make an error handling utility function 
            console.error(chalk.red.bold("ERROR: "), `${err.message}`);

            // Exit the application with an error
            process.exit(1);
        }
    }
}

const Project = new ProjectTemplate();

export default Project;