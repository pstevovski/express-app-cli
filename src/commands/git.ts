import execa from "execa";
import MessagesHandler from "./messages";

async function initializeGit(projectDirectory: string): Promise<void> {
    try {
        await execa('git', ['init'], { cwd: projectDirectory });
    } catch(err) {
        MessagesHandler.error(err.message);
    }
}

export default initializeGit;