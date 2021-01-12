import git from "../../src/commands/git";
import formatProjectPath from "../../src/commands/formatProjectPath";
import fs from "fs";
import path from "path";

describe("INITIALIZE GIT", () => {
    // Remove every file from the test directory
    const folderPath: string = "D:\\projects\\test\\";

    afterEach(() => {
        fs.rmdirSync(path.join(folderPath, ".git"), { recursive: true });
        process.argv.pop();
    });

    it ("should initialize a git repository in the selected project's directory", async() => {
        // Enter the directory's name
        process.argv.push("D:\\projects\\test\\");

        const directory = formatProjectPath(process.argv[process.argv.length - 1]);

        // Initialize git
        await git(directory);

        // Check the directory if a .git folder exists
        const files = fs.readdirSync(directory);

        expect(files.every(file => file.endsWith(".git"))).toBeTruthy();
    });
})