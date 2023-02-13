import IGlueStorePlugin from "@gluestack/framework/types/store/interface/IGluePluginStore";

export interface IStatelessPlugin {
  name: string;
  type: string;
  instance: string;
  port?: number;
  path?: string;
  status?: string;
  template_folder?: string;
  is_backend?: boolean;

  getInitDbPath?: () => string;
  gluePluginStore?: IGlueStorePlugin;
}