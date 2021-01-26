#!/usr/bin/env node

import execa from "execa";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import { Answers } from "inquirer";

import promptUser from "./commands/prompt";
import { ParseArguments } from "./interfaces/IArguments";
import ProjectHandler from "./commands/create-project";
import ArgumentsHandler from "./commands/arguments";
import initializeGit from "./commands/git";
import DependenciesHandler from "./commands/dependencies";
import MessagesHandler from "./commands/messages";

async function startApp(): Promise<void> {
  // Parse the arguments that the user enters when calling the applicaiton
  const parsedArguments: ParseArguments = await ArgumentsHandler.parseArguments(process.argv);

  // Handle errors
  if (!parsedArguments) process.exit(1);

  // Prompt the user for answers based on arguments the user has typed
  const answers: Answers = await promptUser(parsedArguments);
  const { language, database, testLibrary, orm, templatingEngine } = answers;

  console.log("answers", answers)

  // Execute tasks in order
  const tasks = new Listr([
    {
      title: "Creating project's structure...",
      task: () => {
        console.log("");
        ProjectHandler.create({ language, database, testLibrary, orm, templatingEngine }, parsedArguments.directory);
      },
    },
    {
      title: "Initializing Git...",
      task: () => initializeGit(parsedArguments.directory),
    },
    {
      title: "Installing project dependencies using Yarn...",
      task: async (ctx, task) => {
        try {
          await execa("yarn");

          // Install the pre-defined dependencies in the template's package.json file
          await projectInstall({ cwd: parsedArguments.directory });

          // Install production and development dependencies based on what the user selected
          await DependenciesHandler.handleDependencies("yarn", parsedArguments.directory, answers);
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
        await projectInstall({ cwd: parsedArguments.directory });

        // Install production and development dependencies based on what the user selected
        await DependenciesHandler.handleDependencies("npm", parsedArguments.directory, answers);
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
