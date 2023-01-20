import { join } from 'path';
import { readFile } from 'fs/promises';

import { fileExists } from '../helpers/file-exists';
import { writeFile } from '../helpers/write-file';

export const config: any = {
  postgresInstancePath: '',

  postgresConnectionString: '',

  authInstancePath: '',

  backendInstancePath: '',

  engineInstancePath: '',

  hasuraInstancePath: '',

  hasuraInstanceStatus: 'down',

  hasuraEnvs: {}
};

// Gets the configuration
export const getConfig = (key: string): string => config[key];

// Sets the configuration
export const setConfig = (key: string, value: string): string => config[key] = value;

// Prepare the configuration file for the engine
export const prepareConfigJSON = async (newContent: any): Promise<void> => {
  let content: any = {};

  const engineInstance: string = getConfig('engineInstancePath');
  const backendInstance: string = getConfig('backendInstancePath');

  const filepath: string = join(process.cwd(), backendInstance, engineInstance, 'config.json');

  if (await fileExists(filepath)) {
    content = await readFile(filepath);
    content = JSON.parse(content.toString());
  }

  content = {...content, ...newContent};

  await writeFile(filepath, JSON.stringify(content, null, 2));
};
