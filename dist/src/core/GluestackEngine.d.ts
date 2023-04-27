import IApp from "@gluestack/framework/types/app/interface/IApp";
import { IGlueEngine } from "./types/IGlueEngine";
import { IStatelessPlugin } from "./types/IStatelessPlugin";
export default class GluestackEngine implements IGlueEngine {
    private isUpdate;
    private shouldRestart;
    private backendPlugins;
    app: IApp;
    actionPlugins: IStatelessPlugin[];
    statelessPlugins: IStatelessPlugin[];
    devonlyPlugins: IStatelessPlugin[];
    constructor(app: IApp, backendInstancePath: string);
    start(): Promise<void>;
    update(): Promise<void>;
    stop(): Promise<void>;
    collectPlugins(pluginType?: 'stateless' | 'devonly', status?: 'up' | 'down'): Promise<void>;
    createDockerCompose(): Promise<void>;
    startDockerCompose(): Promise<void>;
    stopDockerCompose(): Promise<void>;
    private collectDockerContext;
    generateEnv(): Promise<void>;
    generateRouterJson(): Promise<void>;
}
