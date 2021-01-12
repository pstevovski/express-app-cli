jest.mock("../../src/commands/messages");

import ArgumentsHandler from "../../src/commands/arguments";
import MessagesHandler from "../../src/commands/messages";


describe("ARGUMENTS", () => {
    afterEach(() => {
        jest.clearAllMocks();
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
    })
})