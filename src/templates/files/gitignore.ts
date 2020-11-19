// Create .gitignore file
export const gitignore = (template: string, testing: string) => `# Folders and files to ignore
node_modules/

# Environment files must always be ignored and never commited
.env
${template === "typescript" ? "build/" : ""}
${testing ? "coverage/" : ""}`;