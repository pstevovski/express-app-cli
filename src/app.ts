#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import IParseArguments from "./interfaces/IParseArguments";
import Project from "./commands/create-project";
import ArgumentsHandler from "./commands/parseArguments";

async function startApp(): Promise<void> {
  console.log("Starting express-app CLI...");

  // Parse the arguments that the user enters when calling the applicaiton
  const parsedArguments: IParseArguments | undefined = await ArgumentsHandler.parseArguments(process.argv);

  // Handle errors
  if (!parsedArguments) process.exit(1);

  // Prompt the user for answers based on arguments the user has typed
  const answers: Answers = await promptUser(parsedArguments);
  const { template, db, testing, orm, engine } = answers; 

  // Creates the project template directory and files
  await Project.create({ template, db, testing, orm, engine }, parsedArguments.projectDirectory);

}

startApp();
