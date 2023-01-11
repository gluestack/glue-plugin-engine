import { join } from "path";
import { fileExists } from "./file-exists";
import { createFolder } from "./create-folder";
import { PluginInstance } from "../PluginInstance";

const construct = async (path: string): Promise<void> => {
  await createFolder(path);
};

const checkCreate = async (installationPath: string, folderName: string): Promise<void> => {
  const path: string = join(installationPath, '..', 'events', folderName);

  const appExist: boolean = await fileExists(path);
  if (!appExist) {
    await construct(path);
  }
}

export async function addMainEvents(engineInstance: PluginInstance): Promise<void> {
  const installationPath = engineInstance.getInstallationPath();

  await checkCreate(installationPath, 'database');
  await checkCreate(installationPath, 'app');
};
