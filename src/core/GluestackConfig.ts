
export const config: any = {
  backendInstancePath: '',

  engineInstancePath: '',

  hasuraInstancePath: '',

  hasuraEnvs: {}
};

export const getConfig = (key: string): string => config[key];

export const setConfig = (key: string, value: string): string => config[key] = value;
