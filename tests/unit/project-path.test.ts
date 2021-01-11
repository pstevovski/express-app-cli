import path from "path";

import formatProjectPath from "../../src/commands/formatProjectPath";

describe("FORMAT PATH TO PROJECT:", () => {
    // Remove the pushed argument after each test
    afterEach(() => process.argv.pop());

    describe("Path to project directory:", () => {
        it("if user enters . as argument, it should get the path to the current working directory", () => {
            process.argv.push(".");
            const directory = formatProjectPath(process.argv[2]);
            expect(directory).toMatch(process.cwd())
        });
    
        it("should return false if provided path is not absolute", () => {
            process.argv.push("testFolder\\");
            const isAbsolute = path.isAbsolute(process.argv[2]);
            expect(isAbsolute).toBeFalsy();
        });
    
        it("should return true if provided path is absolute", () => {
            process.argv.push("D:\\Learning\\");
            const isAbsolute = path.isAbsolute(process.argv[2]);
            expect(isAbsolute).toBeTruthy();
        });
    
        it("if user enters a relative path, it should concatenate it to the current working directory", () => {
            process.argv.push("testFolder\\");
            const  directory  = formatProjectPath(process.argv[2]);
            const fullPath = path.join(process.cwd(), process.argv[2]);
            expect(directory).toMatch(fullPath);
        });
    
        it("should normalize and use the path to the project directory, if user specified an ABSOLUTE path", () => {
            process.argv.push("D:\\Learning\\");
            const  directory  = formatProjectPath(process.argv[2]);
            const normalizedAbsolutePath = path.normalize(process.argv[2]);
            expect(directory).toMatch(normalizedAbsolutePath);
        });
    
        it("should use the current working directory (.) if no path was provided as an argument", () => {
            const  directory = formatProjectPath(process.argv[2]);
            expect(directory).toMatch(process.cwd());
        });
    });
});