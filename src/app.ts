#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import parseArguments from "./parseArguments";
import IParseArguments from "./interfaces/IParseArguments";

async function startApp(): Promise<void> {
  console.log("Starting application...");

  const options: IParseArguments = parseArguments(process.argv);

  console.log("OPTIONS: ", options);

  const answers: Answers = await promptUser(options);

  console.log("Answers: ", answers);
}

startApp();
