export default interface IParseArguments {
  projectDirectory: string;
  template: string;
  db: string;
  testing: string,
  orm: string;
  // auth: boolean;
}

export interface IMapParsedArguments {
  DB: string[];
  LANGUAGE: string[];
  TESTING_LIBRARY: string[];
  ORM: string[];
}
