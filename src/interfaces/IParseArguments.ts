export default interface IParseArguments {
  projectDirectory: string;
  template: string;
  db: string;
  testing: string,
  // auth: boolean;
}

export interface IMapParsedArguments {
  DB: string[];
  LANGUAGE: string[];
  TESTING_LIBRARY: string[];
}
