import { IStatelessPlugin } from "./IStatelessPlugin";

interface IHealthCheck {
  test: string[];
  interval: string;
  timeout: string;
  retries: number;
  start_period: string;
}

interface IServiceBase {
  container_name: string
  volumes: string[];
  ports?: string[];
  env_file?: string[];
  environment?: any;
  depends_on?: any;
  restart: string;
  healthcheck?: IHealthCheck;
}

interface IServiceWithBuild extends IServiceBase {
  build: string;
}

interface IServiceWithImage extends IServiceBase {
  image: string;
}

export type IService = IServiceWithBuild | IServiceWithImage;

export interface IDockerCompose {
  version: string;
  services: { [key: string]: IService };

  generate(): Promise<void>;
  addService(name: string, service: IService): void;
  toYAML(): string;

  start(projectName: string, filepath: string): Promise<void>;
  stop(projectName: string, filepath: string): Promise<void>;

  addNginx(plugin: IStatelessPlugin): Promise<void>;
  addHasura(plugin: IStatelessPlugin, postgres: string): Promise<void>;
  addPostgres(plugin: IStatelessPlugin): Promise<void>;
  addOthers(plugin: IStatelessPlugin): Promise<void>;
}
