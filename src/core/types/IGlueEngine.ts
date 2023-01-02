import { IStatelessPlugin } from "./IStatelessPlugin";

export interface IGlueEngine {
  statelessPlugins: IStatelessPlugin[];

  start(): Promise<void>;
  stop(): Promise<void>;

  collectDockerContext(): Promise<void>;

  createDockerCompose(backendInstancePath: string): Promise<void>;
  createNginxConfig(backendInstancePath: string): Promise<void>;

  startDockerCompose(): Promise<void>;
  stopDockerCompose(): Promise<void>;
  cleanDockerVolumes(): Promise<void>;
}
