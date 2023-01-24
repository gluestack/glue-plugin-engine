import { mkdir } from 'node:fs/promises';

export const createFolder = async (path: string): Promise<boolean> => {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    return false;
  }
}