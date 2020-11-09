import ncp from "ncp";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import chalk from "chalk";

const copy = promisify(ncp);
const access = promisify(fs.access);

class CopyFiles {
    private _currentFileURL = __dirname;
    
    // Copy main template project files
    public async copyFiles(userAnswers: ICopyFilesUserAnswers, targetDirectory: string): Promise<void> {
        const { template, db, include_testing } = userAnswers;

        console.log(chalk.blueBright.bold("Creating project directory..."));

        const { main_files, db_files, default_files } = this.getTemplateDirectory(template, db);

        try {
            await access(default_files, fs.constants.R_OK);
            await access(main_files, fs.constants.R_OK);
            await access(db_files, fs.constants.R_OK);
            
            // Copy files from the default files template
            await copy(default_files, targetDirectory, { 
                clobber: false,
                filter: include_testing ? undefined : RegExp('tests')
            });

            // Copy files recursively from main template directory to targeted directory and DO NOT overwrite
            await copy(main_files, targetDirectory, { clobber: false });

            // Copy files recursively from db template directory to targeted directory and ALLOW overwrite
            await copy(db_files, targetDirectory, { clobber: true });


            return console.log(chalk.blueBright.bold("Files copied."));
        } catch (err) {
            console.error(chalk.red.bold("ERROR: "), `${err.message}`);

            // Exit the application with an error
            process.exit(1);
        }
    };
    
    private getTemplateDirectory(template: string, db: string): ITemplateDirectories {
        const pathname: string = new URL(this._currentFileURL).pathname;
        const pathToTemplates: string = `../../src/templates/${template.toLowerCase()}`;

        const main_files: string = path.resolve(pathname, `${pathToTemplates}/server`);
        const db_files: string = path.resolve(pathname, `${pathToTemplates}/db/${db.toLowerCase()}/`);

        // Copy default files and include tests folder if user selected testing option
        const default_files: string = path.resolve(pathname, "../../src/templates/default");

        return { main_files, db_files, default_files };
    }
}

const Copy = new CopyFiles();

export default Copy;