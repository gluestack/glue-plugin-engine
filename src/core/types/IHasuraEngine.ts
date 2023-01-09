import { IStatelessPlugin } from "./IStatelessPlugin";

export interface IAction {
  name: string;
  path: string;
  grapqhl_path: string;
  setting_path: string;
}

export interface IHasuraEngine {
  pluginName: string;
  backendInstancePath: string;
  actionPlugins: IStatelessPlugin[];

  applyMetadata(): Promise<void>;
  reapplyActions(): Promise<void>;
  reapplyEvents(): Promise<void>;
}
