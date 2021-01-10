import execa from "execa";
import { Answers } from "inquirer";
import { IDependenciesHandler, PackageManager } from "../interfaces/IDependencies";

class Dependencies implements IDependenciesHandler {
  // Handle the projcet's dependencies
  public async handleDependencies(packageManager: PackageManager, directory: string, answers: Answers): Promise<void> {
    await this.prodDependencies(packageManager, directory, answers);
    await this.devDependencies(packageManager, directory, answers);
  }

  // Handle the production dependencies
  private async prodDependencies(packageManager: PackageManager, directory: string, answers: Answers): Promise<void> {
    const { database, orm, templatingEngine } = answers;
    const dependencies: string[] = [];

    // Handle database scenarios
    switch (database) {
      case "mongodb":
        dependencies.push("mongoose");
        break;
      case "postgres":
        dependencies.push("pg", "pg-hstore");
        break;
      case "mysql":
        dependencies.push("mysql2");
        break;
      case "sqlite":
        dependencies.push("sqlite3");
        break;
      default:
        dependencies.push("mongoose");
        break;
    }

    // Add ORM dependency if specified by the user
    if (orm) dependencies.push(orm);

    // Add templating engine dependency if specified by the user
    if (templatingEngine) dependencies.push(templatingEngine);

    // Run execa to install the dependencies in the specified directory
    if (packageManager === "npm") {
      await execa("npm", ["install", "--save", ...dependencies], { cwd: directory });
    } else {
      await execa("yarn", ["add", ...dependencies], { cwd: directory });
    }
  }

  // Handle the development-only dependencies
  private async devDependencies(packageManager: PackageManager, directory: string, answers: Answers): Promise<void> {
    const { language, database, testLibrary, orm } = answers;
    const devDependencies: string[] = [];

    // Install types for Mongoose if selected database is MongoDB
    if (language === "typescript") {
      switch (database) {
        case "mongodb":
          devDependencies.push("@types/mongoose");
          break;
        case "postgres":
          devDependencies.push("@types/pg");
          break;
        case "mysql":
          devDependencies.push("@types/mysql2");
          break;
        case "sqlite":
          devDependencies.push("@types/sqlite3");
          break;
        default:
          devDependencies.push("@types/mongoose");
          break;
      }
    }

    // Install Sequelize's Bluebird and Validator types if Sequelize is being used as ORM
    // NOTE: TypeORM handles its required types by itself - no need to install additional types
    if (language === "typescript" && orm === "sequelize") devDependencies.push("@types/bluebird", "@types/validator");

    // Handle the selected testLibrary library dependencies
    switch (testLibrary) {
      case "jest":
        devDependencies.push("jest");

        // Include typescript related dependencies
        if (language === "typescript") devDependencies.push("@types/jest", "ts-jest");

        break;
      case "chai":
        devDependencies.push("chai");

        // Include typescript related dependencies
        if (language === "typescript") devDependencies.push("@types/chai");

        break;
      case "mocha":
        devDependencies.push("mocha");

        // Include typescript related dependencies
        if (language === "typescript") devDependencies.push("@types/mocha");

        break;
      default:
        devDependencies.push("jest");
        break;
    }

    // Run execa to install the dependencies in the specified directory
    if (packageManager === "npm") {
      await execa("npm", ["install", "-D", ...devDependencies], { cwd: directory });
    } else {
      await execa("yarn", ["add", "--dev", ...devDependencies], { cwd: directory });
    }
  }
}

const DependenciesHandler = new Dependencies();

export default DependenciesHandler;
