import { join } from "path";
import { fileExists } from "./file-exists";
import { createFolder } from "./create-folder";
import { PluginInstance } from "../PluginInstance";

const construct = async (path: string): Promise<void> => {
  await createFolder(path);
};

export async function addMainEvents(engineInstance: PluginInstance): Promise<string> {
  const installationPath = engineInstance.getInstallationPath();

  const path = join(installationPath, '..', 'events/database');

  const exist = await fileExists(path);
  if (!exist) {
    await construct(path);
  }

  return Promise.resolve('done');
};