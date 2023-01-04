
export const removeSpecialChars =
  (str: string): string =>
    str.replace(/[^a-zA-Z]/g, '');
