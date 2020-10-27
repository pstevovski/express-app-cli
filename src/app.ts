#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";
import arg from "arg";
import IParseArguments from "./interfaces/IParseArguments";

async function startApp(): Promise<void> {
  console.log("Starting application...");

  const options = parseArguments();

  console.log("OPTIONS: ", options);

  const answers: Answers = await promptUser(options);

  console.log("Answers: ", answers);
}

// Parse the target directory argument
function parseArguments(): IParseArguments {
  const args = arg(
    {
      "--git": Boolean,
      "-g": "--git",
    },
    { argv: process.argv.slice(2) },
  );

  // If user types "." - default to current working directory
  if (args._[0] === ".") args._[0] = process.cwd();

  return {
    projectDirectory: args._[0] || process.cwd(),
    git: args["--git"] || false,
    template: args._[1],
  };
}

startApp();
