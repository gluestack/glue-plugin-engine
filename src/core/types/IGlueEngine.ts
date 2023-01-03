import { IStatelessPlugin } from "./IStatelessPlugin";

export interface IGlueEngine {
  statelessPlugins: IStatelessPlugin[];

  start(backendInstancePath: string): Promise<void>;
  stop(backendInstancePath: string): Promise<void>;

  startDockerCompose(backendInstancePath: string): Promise<void>;
  stopDockerCompose(backendInstancePath: string): Promise<void>;

  collectDockerfiles(): Promise<void>;
  createDockerCompose(backendInstancePath: string): Promise<void>;
  createNginxConfig(backendInstancePath: string): Promise<void>;
}
