#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
// import parseArguments from "./parseArguments";
import IParseArguments from "./interfaces/IParseArguments";
import Copy from "./commands/copyFiles";
import ArgumentsHandler from "./parseArguments";
import chalk from "chalk";

async function startApp(): Promise<void> {
  console.log("Starting application...");

  // const options: IParseArguments = parseArguments(process.argv);
  const parsedArguments: IParseArguments | undefined = await ArgumentsHandler.parseArguments(process.argv);

  // Exit due to error
  if (!parsedArguments) {
    console.log(chalk.bgBlue.white.bold("Exiting application..."));
    process.exit(1);
  };

  console.log("OPTIONS: ", parsedArguments);

  const answers: Answers = await promptUser(parsedArguments);

  console.log("Answers: ", answers);

  const { template, db, include_testing } = answers; 
  await Copy.copyFiles({ template, db, include_testing }, parsedArguments.projectDirectory);
}

startApp();
