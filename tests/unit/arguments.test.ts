jest.mock("../../src/commands/messages");

import ArgumentsHandler from "../../src/commands/arguments";
import MessagesHandler from "../../src/commands/messages";


describe("ARGUMENTS", () => {
    afterEach(() => {
        jest.clearAllMocks();
        process.argv.splice(2, process.argv.length - 1);
    });

    describe("HELP", () => {
        const spy = jest.spyOn(MessagesHandler, "help");

        it("should show help message if user enters --help argument", async () => {
            process.argv.push("--help");

            await ArgumentsHandler.parseArguments(process.argv);

            expect(spy).toHaveBeenCalled();
        });

        it("should show the help message if user enters --h shorthand", async() => {
            process.argv.push("--h");

            await ArgumentsHandler.parseArguments(process.argv);

            expect(spy).toHaveBeenCalled();
        });
    });

    describe("VERSION", () => {
        const spy = jest.spyOn(MessagesHandler, "version");

        it("should show the CLI version if user enters --version argument", async() => {
            process.argv.push("--version");

            await ArgumentsHandler.parseArguments(process.argv);

            expect(spy).toHaveBeenCalled();
        });

        it("should show the CLI version if user enters --v shorthand", async() => {
            process.argv.push("--v");

            await ArgumentsHandler.parseArguments(process.argv);

            expect(spy).toHaveBeenCalled();
        })
    });

    describe("MAP ARGUMENTS", () => {
        it("should return default project setup (javascript, mongodb & jest) with an info message", async() => {
            const spy = jest.spyOn(MessagesHandler, "info");

            process.argv.push("--default");

            const parsedArguments = await ArgumentsHandler.parseArguments(process.argv);

            expect(spy).toHaveBeenCalledWith("Creating default project template: JavaScript, MongoDB with Jest testing library.");
            expect(parsedArguments!.language).toMatch("javascript");
            expect(parsedArguments!.database).toMatch("mongodb");
            expect(parsedArguments!.testLibrary).toMatch("jest");
        });

        it("should throw an error if multiple arguments of same category were used", async() => {
            const spy = jest.spyOn(MessagesHandler, "error");

            process.argv.push("--mongodb", "--pg");
            
            await ArgumentsHandler.parseArguments(process.argv);

            expect(spy).toHaveBeenCalledWith("Invalid number of arguments provided.");
        });

        it("should throw an error if we try to use MongoDB with Sequelize/TypeORM argument", async() => {
            const spy = jest.spyOn(MessagesHandler, "error");

            process.argv.push("--mongodb", "--sequelize");

            await ArgumentsHandler.parseArguments(process.argv);

            expect(spy).toHaveBeenCalledWith("You can't use an ORM for a SQL database, with MongoDB.");
        });
    })
})