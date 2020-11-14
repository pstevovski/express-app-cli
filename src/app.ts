#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import IParseArguments from "./interfaces/IParseArguments";
import Project from "./commands/create-project";
import ArgumentsHandler from "./commands/parseArguments";
import chalk from "chalk";

async function startApp(): Promise<void> {
  console.log("Starting express-app CLI...");

  // Parse the arguments that the user enters when calling the applicaiton
  const parsedArguments: IParseArguments | undefined = await ArgumentsHandler.parseArguments(process.argv);

  // Exit due to error
  if (!parsedArguments) {
    console.log(chalk.bgBlue.white.bold("Exiting application..."));
    process.exit(1);
  };

  // Prompt the user for answers based on arguments the user has typed
  const answers: Answers = await promptUser(parsedArguments);
  const { template, db, testing } = answers; 

  // Creates the project template directory and files
  await Project.create({ template, db, testing }, parsedArguments.projectDirectory);

}

startApp();
