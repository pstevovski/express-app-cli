import inquirer, { Answers } from "inquirer";
import { IArgumentsParsed } from "../interfaces/IArguments";

const promptUser = async ({ template, db, testing, orm, engine }: IArgumentsParsed): Promise<Answers> => {
  let questions: Answers[] = [];

  // Checks for prompting user questions
  const optionalArgumentsExist: boolean = (template && db) && (testing || orm || engine) ? true : false;

  // If any of the optional arguments is passed by the user, use ONLY what was passed as arguments for creating the project
  if (optionalArgumentsExist) {
    return {
      template,
      db,
      testing: testing || null,
      orm: orm || null,
      engine: engine || null
    }
  }

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
    choices: ["MongoDB", "MySQL", "Postgres", "SQLite"]
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
      choices: ["Jest", "Mocha", "Chai"],
      when: (answers: Answers) => answers.include_testing
    }
  );

  if (!orm && db !== "mongodb") questions.push(
    {
      type: "confirm",
      name: "orm_use",
      message: "Would you like to include a ORM to use with the selected SQL database?",
      default: true,
      when: (answers: Answers) => answers.db !== "MongoDB"
    },
    {
      type: "list",
      name: "orm",
      message: "Select the ORM that you'd like to use: ",
      choices: ["Sequelize", "TypeORM"],
      when: (answers: Answers) => answers.orm_use
    }
  );
  
  // If templating engine was not sent as a argument by the user
  if (!engine) questions.push(
    {
      type: "confirm",
      name: "engine_use",
      message: "Would you like to use a templating engine?",
      default: false
    },
    {
      type: "list",
      name: "engine",
      message: "Select a templating engine that you would like to use: ",
      choices: ["Handlebars", "EJS", "Pug"],
      default: false,
      when: (answers: Answers) => answers.engine_use
    }
  );

  const answers: Answers = await inquirer.prompt(questions);

  // Convert all answer's to lowercase
  for (const [key, value] of Object.entries(answers)) {
    answers[key] = typeof value === "string" ? value.toLowerCase() : value;
  }

  const returnedAnswers: Answers = {
    template: template || answers.template,
    db: db || answers.db,
    testing: testing || answers.testing_library,
    orm: orm || answers.orm,
    engine: engine || answers.engine
  }

  return returnedAnswers;
};

export default promptUser;
