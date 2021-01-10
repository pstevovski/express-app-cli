import { Answers } from "inquirer";

export type PackageManager = "npm" | "yarn";

export interface IDependenciesHandler {
  handleDependencies: (packageManager: PackageManager, directory: string, answers: Answers) => Promise<void>;
}
