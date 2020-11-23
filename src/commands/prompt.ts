import inquirer, { Answers } from "inquirer";
import IParseArguments from "../interfaces/IParseArguments";

const promptUser = async ({ template, db, testing, orm }: IParseArguments): Promise<Answers> => {
  let questions: Answers[] = [];

  // If arguments were not passed, prompt the user for answers
  if (!template) questions.push({
    type: "list",
    name: "template",
    message: "Choose the template you want to be used:",
    default: "JavaScript",
    choices: ["JavaScript", "TypeScript"],
  });

  if (!db) questions.push({
    type: "list",
    name: "db",
    message: "Choose the database you would like to be used:",
    choices: ["MongoDB", "MySQL", "PostgreSQL"]
  });

  if (!testing) questions.push(
    {
      type: "confirm",
      name: "include_testing",
      message: "Would you like to include a testing library?",
      default: true
    },
    {
      type: "list",
      name: "testing_library",
      message: "Choose preferred testing library:",
      choices: ["Jest", "Mocha", "Chai", "Jasimne"],
      when: (answers: Answers) => answers.include_testing
    }
  );

  questions.push(
    {
      type: "confirm",
      name: "orm_use",
      message: "Would you like to include a ORM to use with the selected SQL database?",
      default: true,
      when: (answers: Answers) => answers.db === "MySQL" || answers.db === "PostgreSQL"
    },
    {
      type: "list",
      name: "orm_select",
      message: "Select the ORM that you'd like to use: ",
      choices: ["Sequelize", "TypeORM", "Prisma"],
      when: (answers: Answers) => answers.orm_use
    }
  );

  const answers: Answers = await inquirer.prompt(questions);

  const returnedAnswers: Answers = {
    template: template || answers.template,
    db: db || answers.db,
    testing: testing || answers.testing_library,
    orm: orm || answers.orm_select
  }

  return returnedAnswers;
};

export default promptUser;
