import { IStatelessPlugin } from "./IStatelessPlugin";

export interface IGlueEngine {
  statelessPlugins: IStatelessPlugin[];

  start(): Promise<void>;
  stop(): Promise<void>;

  collectDockerContext(): Promise<void>;
  createDockerCompose(): Promise<void>;

  startDockerCompose(): Promise<void>;
  stopDockerCompose(): Promise<void>;
  cleanDockerVolumes(): Promise<void>;
}
