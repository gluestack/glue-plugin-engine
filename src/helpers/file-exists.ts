import { access, constants } from 'node:fs/promises';

export const fileExists = async (path: string): Promise<boolean> => {
  try {
    await access(path, constants.R_OK);
    return Promise.resolve(true);
  } catch (err) {
    return Promise.resolve(false);
  }
};
