import ncp from "ncp";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const copy = promisify(ncp);
const access = promisify(fs.access);

const copyFilesFromTemplate = async(template: string, targetDirectory: string): Promise<any> => {
    const currentFileURL = __dirname;
    const templateDirectory = path.resolve(
        new URL(currentFileURL).pathname,
        "../../src/templates",
        template.toLowerCase()
    );

    console.log("template directory", templateDirectory)

    try {
        await access(templateDirectory, fs.constants.R_OK);
        return copy(templateDirectory, targetDirectory, {
            clobber: false
        });
    } catch(err) {
        console.error("%s Invalid template name");
        process.exit(1);
    };
}

export default copyFilesFromTemplate;