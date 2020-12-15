export default interface IParseArguments {
  projectDirectory: string;
  template: string;
  db: string;
  testing: string,
  orm: string;
  engine: string;
}

export interface IMapParsedArguments {
  DB: string[];
  LANGUAGE: string[];
  TESTING_LIBRARY: string[];
  ORM: string[];
  ENGINE: string[];
}
