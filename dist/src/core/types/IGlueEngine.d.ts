import { IStatelessPlugin } from "./IStatelessPlugin";
export interface IGlueEngine {
    statelessPlugins: IStatelessPlugin[];
    collectPlugins(): Promise<void>;
    start(): Promise<void>;
    update(): Promise<void>;
    stop(): Promise<void>;
    startDockerCompose(): Promise<void>;
    startDockerComposeBuild(): Promise<void>;
    stopDockerCompose(): Promise<void>;
    createDockerCompose(): Promise<void>;
}
