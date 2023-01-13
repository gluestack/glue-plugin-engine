export const removeSpecialChars = (str: string): string =>
  str.replace(/[^a-z0-9]/g, "").toLowerCase();
