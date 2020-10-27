#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import arg from "arg";

async function startApp(): Promise<void> {
  console.log("Starting application...");

  const options = parseArguments();

  console.log("OPTIONS: ", options);

  const answers: Answers = await promptUser();

  console.log("Answers: ", answers);
}

// Parse the target directory argument
function parseArguments() {
  const args = arg({}, { argv: process.argv.slice(2) });

  // If user types "." - default to current working directory
  if (args._[0] === ".") args._[0] = process.cwd();

  return {
    directory: args._[0] || process.cwd(),
  };
}

startApp();
