import { ignorePlugins, daprServices } from '../configs/constants';

export const isValidGluePlugin = (
  backendPlugins: string[], name: string
): string[] => {
  const validPlugins: string[] = [];

  if (ignorePlugins.includes(name)) {
    return validPlugins;
  }

  backendPlugins.forEach(_plugin => {
    if (_plugin === name) {
      validPlugins.push(name);
    }

    if (_plugin.includes('*')) {
      const _name = '@gluestack/glue-plugin-';
      if (name && name.startsWith(_name)) {
        validPlugins.push(name);
      }
    }
  });

  return validPlugins;
};


export const isDaprService = (name: string): boolean => {
  if (daprServices.includes(name)) {
    return true;
  }

  const _name = '@gluestack/glue-plugin-service-';
  if (name.startsWith(_name)) {
    return true
  } else {
    return false;
  }
};

export const isGlueService = (name: string): boolean => {
  const _name = '@gluestack/glue-plugin-service-';
  if (name.startsWith(_name)) {
    return true
  } else {
    return false;
  }
};
