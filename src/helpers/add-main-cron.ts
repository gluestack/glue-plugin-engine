import { join } from "path";
import { writeFile } from "./write-file";
import { fileExists } from "./file-exists";
import { createFolder } from "./create-folder";
import { PluginInstance } from "../PluginInstance";

const construct = async (path: string): Promise<void> => {
  await createFolder(path);
};

const checkCreate = async (installationPath: string, fileName: string, fileContent: string): Promise<void> => {
  const path: string = join(installationPath, '..', 'events', fileName);

  const appExist: boolean = await fileExists(path);
  if (!appExist) {
    await construct(path);
  }

  await writeFile(path, fileContent);
}

export async function addMainCron(engineInstance: PluginInstance): Promise<void> {
  const installationPath = engineInstance.getInstallationPath();

  const fileName: string = 'crons.json';
  const fileContent: object = [];

  await checkCreate(installationPath, fileName, JSON.stringify(fileContent));
};
