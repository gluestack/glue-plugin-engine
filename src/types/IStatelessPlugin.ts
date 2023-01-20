import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";

export interface IStatelessPlugin {
  name: string;
  type: string;
  instance: string;
  port?: number;
  path?: string;
  status?: string;
  template_folder?: string;

  getInitDbPath?: () => string;
  gluePluginStore?: IGlueStorePlugin;
}