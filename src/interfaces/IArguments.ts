export type LanguageTypes = "javascript" | "typescript";
export type DatabaseTypes = "mongodb" | "mysql" | "postgres" | "sqlite";
export type TestingLibraryTypes = "jest" | "chai" | "mocha";
export type OrmTypes = "sequelize" | "typeorm";
export type TemlpatingEngineTypes = "handlebars" | "ejs" | "pug";

export interface ProjectArguments {
  language: LanguageTypes;
  database: DatabaseTypes;
  orm: OrmTypes;
  testLibrary: TestingLibraryTypes;
  templatingEngine: TemlpatingEngineTypes;
}

export interface ParsedArguments extends ProjectArguments {
  directory: string;
}
export interface MappedArguments {
  DATABASE: DatabaseTypes[];
  LANGUAGE: LanguageTypes[];
  TESTING_LIBRARY: TestingLibraryTypes[];
  ORM: OrmTypes[];
  TEMPLATING_ENGINE: TemlpatingEngineTypes[];
}

export type ParseArguments = ParsedArguments | undefined;
