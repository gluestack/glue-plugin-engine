import { IStatelessPlugin } from './types/IStatelessPlugin';
import { IDockerCompose, IService } from './types/IDockerCompose';
export default class DockerCompose implements IDockerCompose {
    version: string;
    services: {
        [key: string]: IService;
    };
    constructor();
    toYAML(): string;
    addService(name: string, service: IService): void;
    generate(): Promise<void>;
    addNginx(plugin: IStatelessPlugin, hasura: string): Promise<void>;
    addHasura(plugin: IStatelessPlugin, postgres: string): Promise<void>;
    addPostgres(plugin: IStatelessPlugin): Promise<void>;
    addWeb(plugin: IStatelessPlugin): Promise<void>;
    addMinio(plugin: IStatelessPlugin): Promise<void>;
    private addMinioCreatebuckets;
    addPGAdmin(plugin: IStatelessPlugin, postgres: string): Promise<void>;
    addStorybook(plugin: IStatelessPlugin): Promise<void>;
    addOthers(plugin: IStatelessPlugin): Promise<void>;
    start(projectName: string, filepath: string): Promise<void>;
    build(projectName: string, filepath: string): Promise<void>;
    stop(projectName: string, filepath: string): Promise<void>;
}
