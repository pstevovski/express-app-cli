export interface IArgumentsParsed {
  projectDirectory: string;
  template: string;
  db: string;
  testing: string,
  orm: string;
  engine: string;
}

export interface IArgumentsMapped {
  DB: string[];
  LANGUAGE: string[];
  TESTING_LIBRARY: string[];
  ORM: string[];
  ENGINE: string[];
}
