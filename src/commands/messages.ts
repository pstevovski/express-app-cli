import chalk from "chalk";
import { Answers } from "inquirer";
class Messages {
  private link = "https://github.com/pstevovski/express-app-cli";

  // Display error messages
  public error(message: string): void {
    console.log();
    console.log(chalk.red("❌ ERROR:"), message);
    console.log();
    console.log(`See ${chalk.blueBright("--help")} for more information.`);
    console.log();

    // Exit the application with an error
    process.exit(1);
  }

  // Display success related messages
  public success(message: string): void {
    console.log("");
    console.log(chalk.green("✅ DONE "), message);
    console.log("");
  }

  // Display informataive messages
  public info(message: string): void {
    console.log();
    console.log(chalk.blueBright.bold("INFO: "), message);
    console.log();
  }

  // Display message about how to start, watch and build the application, on which port, selected project configuration etc.
  public projectInfo(answers: Answers): void {
    const { language, database, orm, templatingEngine, testLibrary } = answers;

    console.log("Selected project configuration: ");
    console.log(chalk.blueBright("- Template:"), language);
    console.log(chalk.blueBright("- Database:"), database);
    console.log(chalk.blueBright("- Testing Library:"), testLibrary ?? "none");
    console.log(
      chalk.blueBright("- ORM:"),
      orm && database !== "mongodb" ? orm : database === "mongodb" ? "mongoose" : "none",
    );
    console.log(chalk.blueBright("- Templating Engine:"), templatingEngine ?? "none");
    console.log();
    console.log(
      `You can start the server by running ${chalk.blueBright(
        "'npm run watch'",
      )} which will track any changes and restart the server when needed.`,
    );
    console.log();

    if (language === "typescript") {
      console.log(`You can build the project by running ${chalk.blueBright("'npm run build'")}.`);
      console.log();
      console.log(
        `❕ ${chalk.blueBright.bold(
          "NOTE",
        )}: It is recommended that you start and watch the project by using the provided ${chalk.blueBright(
          "'npm run watch'",
        )} command, because running ${chalk.blueBright(
          "'npm run start'",
        )} command will require the project to be built first.`,
      );
      console.log();
    }

    console.log(
      `The server by default starts at ${chalk.blueBright("PORT: 3000")}. You can change this in the .env file.`,
    );
    console.log();
    console.log(
      chalk.bold(
        `If you have any recommendations for changes, or you've found some bug, please open an issue or a pull request at: ${this.link}`,
      ),
    );
    console.log();
    console.log("Happy coding !");
  }

  // Display Help related information
  public help(): void {
    console.log();
    console.log(
      `${chalk.blueBright.bold("express-app CLI")} is used for fast bootstrapping your NodeJS / Express project.`,
    );
    console.log();
    console.log(`This CLI provides multiple options to customize your project including:
    - language template
    - database 
    - testing library
    - ORM (if using a SQL database) 
    - templating engine`);
    console.log();
    console.log("Usage: ");
    console.log(chalk.blueBright(" $ npx express-app <project-directory> [options]"));
    console.log();
    console.log(`Or if installed locally trough ${chalk.blueBright("'npm install -g express-app-cli'")}: `);
    console.log(chalk.blueBright(" $ express-app <project-directory> [options]"));
    console.log();
    console.log("Example: ");
    console.log(chalk.blueBright(" $ express-app example\\ --ts --mongodb --jest"));
    console.log();
    console.log(
      "If no arguments are provided, the user will be asked a series of questions regarding the project's structure.",
    );
    console.log();
    console.log(`Options include:
    --default -> Creates a project with: Javascript, MongoDB & Jest

    --javascript -> selects Javascript as a language
    --typescript -> selects Typescript as a language

    --mongodb  -> selects MongoDB database (& Mongoose)
    --postgres -> selects Postgres database
    --mysql    -> selects MySQL database
    --sqlite   -> selects SQLite database

    --jest  -> Selects Jest testing library
    --chai  -> Selects Chai testing library
    --mocha -> Selects Mocha testing library

    --sequelize -> Selects Sequelize ORM
    --typeorm   -> Selects TypeORM 

    --handlebars -> Selects Handlebars templating engine
    --ejs -> Selects EJS templating engine
    --pug -> Selects Pug templating engine

    --version -> Provides the version of the application
    --help    -> Provides the information regarding the application`);
    console.log();
    console.log(`Shorthands: 
    --v   -> --version
    --h   -> --help
    --js  -> --javascript
    --ts  -> --typescript
    --pg  -> --postgres
    --hbs -> --handlebars`);
    console.log();
    console.log(
      chalk.bold(
        `If you have any recommendations for changes, or you've found some bug, please open an issue or a pull request at: ${this.link}`,
      ),
    );

    // Exit the application without error
    process.exit(0);
  }

  // Display CLI Version related information
  public version(): void {
    const packageJSON = require("../../package.json");

    console.log();
    console.log(`v${packageJSON.version}`);

    // Exit the application without error
    process.exit(0);
  }
}

const MessagesHandler = new Messages();

export default MessagesHandler;
