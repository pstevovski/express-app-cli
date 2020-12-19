#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import IParseArguments from "./interfaces/IParseArguments";
import Project from "./commands/create-project";
import ArgumentsHandler from "./commands/parseArguments";
import initializeGit from "./commands/git";
import Listr from "listr";
import chalk from "chalk";
import { projectInstall } from "pkg-install";
import execa from "execa";
import Dependencies from "./commands/dependencies";

async function startApp(): Promise<void> {
  // Parse the arguments that the user enters when calling the applicaiton
  const parsedArguments: IParseArguments | undefined = await ArgumentsHandler.parseArguments(process.argv);

  // Handle errors
  if (!parsedArguments) process.exit(1);

  // Prompt the user for answers based on arguments the user has typed
  const answers: Answers = await promptUser(parsedArguments);
  const { template, db, testing, orm, engine } = answers; 

  // Makes a list of dependencies to install based on provided arguments / answers by the user
  const dependencies = Dependencies.prodDependencies(answers);

  const tasks = new Listr([
    {
      title: "Creating project's structure...",
      task: () => {
        console.log("");
        Project.create({ template, db, testing, orm, engine }, parsedArguments.projectDirectory)
      }
    },
    {
      title: "Initializing Git...",
      task: () => initializeGit(parsedArguments.projectDirectory)
    },
    {
      title: "Installing dependencies...",
      task: async () => {
        await projectInstall({ cwd: parsedArguments.projectDirectory });
        await execa("npm", ["install", "--save", ...dependencies], { cwd: parsedArguments.projectDirectory });

        // Install development-only dependencies
        const devDependencies: string[] = Dependencies.devDependencies(answers);

        await execa("npm", ["install", "-D", ...devDependencies], { cwd: parsedArguments.projectDirectory });
      }
    }
  ]);

  await tasks.run();

  // TODO: Move to a separate utility function for handling text to be displayed in the CLI 
  console.log("");
  console.log(chalk.green.bold("DONE"), "Project has been created!");
  console.log("");

  process.exit(0);
}

startApp();
