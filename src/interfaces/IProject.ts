export interface ITemplateDirectories {
    main_files: string;
    dbFiles: string;
    default_files: string;
    defaultSQL: string;
}

export interface IProjectCreate {
    template: string;
    db: string;
    testing: string;
    orm: string;
}

export interface IProjectConfigTemplates {
    template: string;
    db: string;
    orm: string;
    // auth: string;
};