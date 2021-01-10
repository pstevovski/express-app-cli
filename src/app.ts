#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import { ParseArguments } from "./interfaces/IArguments";
import Project from "./commands/create-project";
import ArgumentsHandler from "./commands/arguments";
import initializeGit from "./commands/git";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import DependenciesHandler from "./commands/dependencies";
import execa from "execa";
import MessagesHandler from "./commands/messages";

async function startApp(): Promise<void> {
  // Parse the arguments that the user enters when calling the applicaiton
  const parsedArguments: ParseArguments = await ArgumentsHandler.parseArguments(process.argv);

  // Handle errors
  if (!parsedArguments) process.exit(1);

  // Prompt the user for answers based on arguments the user has typed
  const answers: Answers = await promptUser(parsedArguments);
  const { template, db, testing, orm, engine } = answers;

  const tasks = new Listr([
    {
      title: "Creating project's structure...",
      task: () => {
        console.log("");
        Project.create({ template, db, testing, orm, engine }, parsedArguments.projectDirectory);
      },
    },
    {
      title: "Initializing Git...",
      task: () => initializeGit(parsedArguments.projectDirectory),
    },
    {
      title: "Installing project dependencies using Yarn...",
      task: async (ctx, task) => {
        try {
          await execa("yarn");

          // Install the pre-defined dependencies in the template's package.json file
          await projectInstall({ cwd: parsedArguments.projectDirectory });

          // Install production and development dependencies based on what the user selected
          await DependenciesHandler.handleDependencies("yarn", parsedArguments.projectDirectory, answers);
        } catch (err) {
          ctx.yarn = false;
          task.skip("Yarn is not available. Install it via 'npm install -g yarn' .");
        }
      },
    },
    {
      title: "Installing project dependencies using NPM...",
      enabled: (ctx) => ctx.yarn === false,
      task: async () => {
        // Install the pre-defined dependencies in the template's package.json file
        await projectInstall({ cwd: parsedArguments.projectDirectory });

        // Install production and development dependencies based on what the user selected
        await DependenciesHandler.handleDependencies("npm", parsedArguments.projectDirectory, answers);
      },
    },
  ]);

  await tasks.run();

  // Display messages about the project
  MessagesHandler.success("Project has been created!");
  MessagesHandler.projectInfo(answers);

  process.exit(0);
}

startApp();
