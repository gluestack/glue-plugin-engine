
export const removeTrailingSlash = (str: string): string => {
  if (str !== "/") {
    return str.replace(/\/$/, "");
  }
  return str;
};
