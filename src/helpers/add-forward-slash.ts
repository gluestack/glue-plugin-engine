export const addForwardSlash = (str: string): string => {
  if (str[0] === '/') {
    return str;
  } else {
    return '/' + str;
  }
};
