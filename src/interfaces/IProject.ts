export interface ITemplateDirectories {
    main_files: string;
    dbFiles: string;
    default_files: string;
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
};