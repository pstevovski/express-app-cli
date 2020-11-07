import ncp from "ncp";
import { promisify } from "util";
import path from "path";
import fs from "fs";
import chalk from "chalk";

const copy = promisify(ncp);
const access = promisify(fs.access);

class Copy {
    private _currentFileURL = __dirname;
    
    // Copy main template project files
    public async copyFiles(template: string, db: string, targetDirectory: string): Promise<void> {
        console.log(chalk.blueBright.bold("Creating project directory..."));

        const { main_files, db_files } = this.getTemplateDirectory(template, db);

        try {
            await access(main_files, fs.constants.R_OK);
            await access(db_files, fs.constants.R_OK);

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

        return { main_files, db_files };
    }
}

const CopyFiles = new Copy();

export default CopyFiles;