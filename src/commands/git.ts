import execa from "execa";

async function initializeGit(projectDirectory: string): Promise<void> {
    try {
        await execa('git', ['init'], { cwd: projectDirectory });
    } catch(err) {
        // TODO: Handle errors trough separate function
        console.log("GIT INITIALIZE ERROR: ", err.message);
    }
}

export default initializeGit;