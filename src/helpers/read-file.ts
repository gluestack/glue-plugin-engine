import { readFile } from 'node:fs/promises';

export const readFileContent = async (fileName: string): Promise<string | boolean> => {
  try {
    const content: string = await readFile(fileName, 'utf8');
    return Promise.resolve(content);
  } catch (err) {
    return Promise.reject(false);
  }
};
