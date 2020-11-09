interface ITemplateDirectories {
    main_files: string;
    db_files: string;
    default_files: string;
}

interface ICopyFilesUserAnswers {
    template: string;
    db: string;
    include_testing: boolean;
}