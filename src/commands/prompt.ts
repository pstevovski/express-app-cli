import inquirer, { Answers } from "inquirer";

const promptUser = async (): Promise<Answers> => {
  const answers: Answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Choose the template you want to be used:",
      default: "javascript",
      choices: ["Javascript", "Javascript ES6+ (with Babel)", "Typescript"],
    },
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
      name: "includeTestingLib",
      message: "Would you like to include a testing library?",
      default: true,
    },
    {
      type: "list",
      name: "testingLibrary",
      message: "Choose preferred testing library:",
      default: "Jest",
      choices: ["Jest", "Mocha", "Chai"],
      when: (answers) => answers.includeTestingLib,
    },
    {
      type: "confirm",
      name: "validation",
      message: "Would you liket to include a valdation library?",
      default: true,
    },
    {
      type: "list",
      name: "validationLibrary",
      message: "Selected validation library to be used:",
      choices: ["Yup", "Joi"],
      when: (answers) => answers.validation,
    },
    {
      type: "checkbox",
      name: "extraDependencies",
      message: "Other dependencies you would like to be included:",
      choices: ["winston", "morgan", "bcrypt", "jsonwebtoken"],
    },
  ]);

  return answers;
};

export default promptUser;
