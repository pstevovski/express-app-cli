#!/usr/bin/env node

import promptUser from "./commands/prompt";
import { Answers } from "inquirer";

async function startApp(): Promise<void> {
  console.log("Starting application...");

  const answers: Answers = await promptUser();

  console.log("Answers: ", answers);
}

startApp();
