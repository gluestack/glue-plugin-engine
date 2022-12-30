import { IBuild } from './types/IBuild';

export class DockerCompose {
  public version: string;
  public services: { [key: string]: Service };
}

export class Service {
  public name: string;
  public build: IBuild;
  public ports: string[];
  public volumes: string[];
  public env_file: string[];
  public depends_on: string[];
  public restart: string = 'always';

  constructor(
    name: string,
    build: IBuild,
    ports: string[],
    volumes: string[],
    env_file: string[],
    depends_on: string[],
    restart: string = 'always'
  ) {
    this.name = name;
    this.build = build;
    this.ports = ports;
    this.volumes = volumes;
    this.env_file = env_file;
    this.depends_on = depends_on;
    this.restart = restart;
  }

  public toJSON() {
  }

  public toYAML() {

  }
}

export default DockerCompose;
