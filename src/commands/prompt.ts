import inquirer, { Answers } from "inquirer";
import { ParsedArguments } from "../interfaces/IArguments";

const promptUser = async ({ language, database, testLibrary, orm, templatingEngine }: ParsedArguments): Promise<Answers> => {
  const questions: Answers[] = [];

  // If optional arguments are provided (testing, orm, engine) then use only what was provided and dont ask questions
  const optionalArgumentsExist: boolean = language && database && (testLibrary || orm || templatingEngine) ? true : false;

  // If any of the optional arguments is passed by the user, use ONLY what was passed as arguments for creating the project
  if (optionalArgumentsExist) {
    return {
      language,
      database,
      testLibrary: testLibrary || null,
      orm: orm || null,
      templatingEngine: templatingEngine || null,
    };
  }

  // If arguments were not passed, prompt the user for answers
  if (!language)
    questions.push({
      type: "list",
      name: "template",
      message: "Choose the template you want to be used:",
      default: "JavaScript",
      choices: ["JavaScript", "TypeScript"],
    });

  if (!database)
    questions.push({
      type: "list",
      name: "database",
      message: "Choose the database you would like to be used:",
      choices: ["MongoDB", "MySQL", "Postgres", "SQLite"],
    });

  if (!testLibrary)
    questions.push(
      {
        type: "confirm",
        name: "include_testing",
        message: "Would you like to include a testing library?",
        default: true,
      },
      {
        type: "list",
        name: "testLibrary",
        message: "Choose preferred testing library:",
        choices: ["Jest", "Mocha", "Chai"],
        when: (answers: Answers) => answers.include_testing,
      },
    );

  if (!orm && database !== "mongodb")
    questions.push(
      {
        type: "confirm",
        name: "orm_use",
        message: "Would you like to include a ORM to use with the selected SQL database?",
        default: true,
        when: (answers: Answers) => answers.database !== "MongoDB",
      },
      {
        type: "list",
        name: "orm",
        message: "Select the ORM that you'd like to use: ",
        choices: ["Sequelize", "TypeORM"],
        when: (answers: Answers) => answers.orm_use,
      },
    );

  // If templating engine was not sent as a argument by the user
  if (!templatingEngine)
    questions.push(
      {
        type: "confirm",
        name: "engine_use",
        message: "Would you like to use a templating engine?",
        default: false,
      },
      {
        type: "list",
        name: "templatingEngine",
        message: "Select a templating engine that you would like to use: ",
        choices: ["Handlebars", "EJS", "Pug"],
        when: (answers: Answers) => answers.engine_use,
      },
    );

  const answers: Answers = await inquirer.prompt(questions);

  // Convert all answer's to lowercase
  for (const [key, value] of Object.entries(answers)) {
    answers[key] = typeof value === "string" ? value.toLowerCase() : value;
  }

  const returnedAnswers: Answers = {
    language: language || answers.language,
    database: database || answers.database,
    testLibrary: testLibrary || answers.testLibrary,
    orm: orm || answers.orm,
    templatingEngine: templatingEngine || answers.templatingEngine,
  };

  return returnedAnswers;
};

export default promptUser;
