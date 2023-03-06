export const replaceDirectoryName =
  (str: string): string =>
    str.replace(/[^a-zA-Z0-9\-_]/g, '').toLowerCase();