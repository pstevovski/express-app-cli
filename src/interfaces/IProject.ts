export interface ITemplateDirectories {
  mainFiles: string;
  dbFiles: string;
  defaultFiles: string;
  defaultSQL: string;
  config: string;
}

export interface IProjectCreate {
  template: string;
  db: string;
  testing: string;
  orm: string;
  engine: string;
}

export interface IProjectConfigTemplates {
  template: string;
  db: string;
  orm?: string;
  engine?: string;
}
