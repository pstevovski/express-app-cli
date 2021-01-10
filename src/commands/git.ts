import execa from "execa";
import MessagesHandler from "./messages";

async function initializeGit(directory: string): Promise<void> {
  try {
    await execa("git", ["init"], { cwd: directory });
  } catch (err) {
    MessagesHandler.error(err.message);
  }
}

export default initializeGit;
