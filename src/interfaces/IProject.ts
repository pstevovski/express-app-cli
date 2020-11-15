export interface ITemplateDirectories {
    main_files: string;
    dbFiles: string;
    default_files: string;
}

export interface IProjectCreate {
    template: string;
    db: string;
    testing: string;
}

export interface IProjectConfigTemplates {
    template: string;
    db: string;
    // auth: string;
};