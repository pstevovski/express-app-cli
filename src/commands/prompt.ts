import inquirer, { Answers } from "inquirer";
import IParseArguments from "../interfaces/IParseArguments";

const promptUser = async ({ git, template }: IParseArguments): Promise<Answers> => {
  // Default questions
  const questions: Answers[] = [
    {
      type: "list",
      name: "db",
      message: "Choose the database you would like to be used:",
      choices: ["MongoDB", "DynamoDB", "MySQL", "PostgreSQL"],
    },
    {
      type: "confirm",
      name: "linting",
      message: "Should it include linting?",
      default: true,
    },
    {
      type: "confirm",
      name: "include_testing",
      message: "Would you like to include a testing library?",
      default: true,
    },
    {
      type: "list",
      name: "testing_library",
      message: "Choose preferred testing library:",
      default: "Jest",
      choices: ["Jest", "Mocha", "Chai"],
      when: (answers: Answers) => answers.include_testing,
    },
    {
      type: "checkbox",
      name: "extraDependencies",
      message: "Other dependencies you would like to be included:",
      choices: ["winston", "morgan", "bcrypt", "jsonwebtoken"],
    },
  ];

  // If git was not sent as an argument, ask a question
  if (!git)
    questions.unshift({
      type: "confirm",
      name: "git",
      message: "Would you like to initialize git?",
      default: true,
    });

  // If project template was not sent as argument, ask a question
  if (!template)
    questions.unshift({
      type: "list",
      name: "template",
      message: "Choose the template you want to be used:",
      default: "JavaScript",
      choices: ["JavaScript", "TypeScript"],
    });

  const answers: Answers = await inquirer.prompt(questions);

  return answers;
};

export default promptUser;
