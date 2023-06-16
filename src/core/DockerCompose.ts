
import { join } from 'path';
import * as yaml from 'yaml';
import { execute } from '../helpers/spawn';
import { getConfig } from './GluestackConfig';
import {
  removeSpecialChars, writeFile, fileExists, createFolder
} from "@gluestack/helpers";
import { IStatelessPlugin } from './types/IStatelessPlugin';
import { IDockerCompose, IService } from './types/IDockerCompose';

/**
 * Docker Compose
 *
 * This class is responsible for generating the docker-compose.yml file
 * in your backend instance's engine/router folder.
 */
export default class DockerCompose implements IDockerCompose {
  public version: string = '3.9';
  public services: { [key: string]: IService };

  constructor() {
    this.services = {};
  }

  // Converts the docker-compose json data to YAML
  public toYAML() {
    return yaml.stringify({
      version: this.version,
      services: this.services
    });
  }

  // Adds a service to the docker-compose file
  public addService(name: string, service: IService) {
    service.extra_hosts = [
      "host.docker.internal:host-gateway"
    ]
    this.services[removeSpecialChars(name)] = service;
  }

  // Generates the docker-compose file
  public async generate() {
    const directory: string = join(process.cwd(), 'meta/router');
    if (!await fileExists(directory)) {
      await createFolder(directory);
    }

    await writeFile(
      join(
        directory,
        'docker-compose.yml'
      ),
      this.toYAML()
    );
  }

  // Adds the nginx service to the docker-compose file
  public async addNginx(plugin: IStatelessPlugin, hasura: string) {
    const instance: any = plugin.instance_object;
    const name = await instance.getName();
    const filepath = join(process.cwd(), 'meta', 'router', name, 'routes.json');
    if (!await fileExists(filepath)) {
      console.log('> No routes.json file found. Skipping nginx container.');
      return;
    }

    // mapped all the subdomain ports with the nginx container
    const data = require(filepath);
    const ports = data.map((item: any) => `${item.port}:${item.port}`);

    const nginx: IService = {
      container_name: 'nginx',
      restart: 'always',
      build: plugin.path,
      ports,
      volumes: [
        `${join(plugin.path, 'nginx.conf')}:/etc/nginx/nginx.conf`
      ]
    };

    if (hasura && hasura !== '') {
      nginx.depends_on = {};
      nginx.depends_on[`${removeSpecialChars(hasura)}`] = {
        condition: 'service_healthy'
      }
    }

    this.addService('nginx', nginx);
  }

  // Adds the hasura service to the docker-compose file
  public async addHasura(plugin: IStatelessPlugin, postgres: string) {
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');
    const isPostgresExternal = getConfig('isPostgresExternal');

    const hasura: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'always',
      image: 'hasura/graphql-engine:v2.24.1',
      ports: [
        `${port_number}:8080`
      ],
      volumes: [
        `${plugin.path}:/hasura`,
      ],
      env_file: [
        `${plugin.path}/.env.generated`
      ],
      healthcheck: {
        test: [
          "CMD-SHELL",
          `timeout 1s bash -c ':> /dev/tcp/127.0.0.1/8080' || exit 1`
        ],
        interval: '5s',
        timeout: '2s',
        retries: 20
      }
    };

    if (postgres && postgres !== '' && isPostgresExternal === 0) {
      hasura.depends_on = {};
      hasura.depends_on[`${removeSpecialChars(postgres)}`] = {
        condition: 'service_healthy'
      }
    }

    this.addService(plugin.instance, hasura);
  }

  // Adds the hasura service to the docker-compose file
  public async addPostgres(plugin: IStatelessPlugin) {
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');
    const db_config = instance.gluePluginStore.get('db_config');

    const postgres: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'always',
      image: 'postgres:12',
      ports: [
        `${port_number}:5432`
      ],
      volumes: [
        `${plugin.path}/db:/var/lib/postgresql/data/`
      ],
      environment: {
        POSTGRES_USER: `${db_config.username}`,
        POSTGRES_PASSWORD: `${db_config.password}`,
        POSTGRES_DB: `${db_config.db_name}`
      },
      healthcheck: {
        test: [
          "CMD-SHELL",
          `psql -U ${db_config.username} -d ${db_config.db_name}`
        ],
        interval: '10s',
        timeout: '10s',
        retries: 50,
        start_period: '30s'
      }
    };

    this.addService(plugin.instance, postgres);
  }

  // Adds the web services to the docker-compose file
  public async addWeb(plugin: IStatelessPlugin) {
    const name: string = plugin.instance;
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');
    const bindingPath: string = join(plugin.path, '..');

    const service: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'unless-stopped',
      build: plugin.path,
      ports: [
        `${port_number}:9000`
      ],
      volumes: [
        `${bindingPath}:/gluestack`,
        `/gluestack/${name}/node_modules/`,
        `/gluestack/${name}/.next/`
      ]
    };

    if (await fileExists(`${plugin.path}/.env.generated`)) {
      service.env_file = [
        `${plugin.path}/.env.generated`
      ]
    }

    this.addService(name, service);
  }

  // Adds the minio service to the docker-compose file
  public async addMinio(plugin: IStatelessPlugin) {
    const instance: any = plugin.instance_object;

    const port_number = await instance.gluePluginStore.get('port_number');
    const console_port_number = await instance.gluePluginStore.get('console_port_number');
    const minio_credentials = await instance.getContainerController().getEnv();

    const minio: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'always',
      image: 'minio/minio',
      command: 'server /data --console-address ":9001"',
      ports: [
        `${port_number}:9000`,
        `${console_port_number}:9001`,
      ],
      volumes: [
        `${plugin.path}/data:/data`
      ],
      environment: { ...minio_credentials },
      healthcheck: {
        test: [
          "CMD",
          "curl",
          "-f",
          `http://${removeSpecialChars(plugin.instance)}:9000/minio/health/live`,
        ],
        interval: '5s',
        timeout: '2s',
        retries: 20
      },
    };

    this.addService(plugin.instance, minio);
    await this.addMinioCreatebuckets(plugin);
  }

  // Adds the minio service to the docker-compose file
  private async addMinioCreatebuckets(plugin: IStatelessPlugin) {
    const instance: any = plugin.instance_object;

    const minio_credentials = await instance.getContainerController().getEnv();

    const createBuckets: IService = {
      container_name: removeSpecialChars(`createbuckets${plugin.instance}}`),
      restart: "always",
      image: "minio/mc",
      entrypoint: "sh",
      command: `-c "mc config host add myminio http://${removeSpecialChars(plugin.instance)}:9000 ${minio_credentials.MINIO_ACCESS_KEY} ${minio_credentials.MINIO_SECRET_KEY} && if ! mc ls myminio/${minio_credentials.MINIO_PUBLIC_BUCKET} ; then mc mb myminio/${minio_credentials.MINIO_PUBLIC_BUCKET} && mc anonymous set public myminio/${minio_credentials.MINIO_PUBLIC_BUCKET}; fi && if ! mc ls myminio/${minio_credentials.MINIO_PRIVATE_BUCKET} ; then mc mb myminio/${minio_credentials.MINIO_PRIVATE_BUCKET}; fi"`,
      depends_on: {
        [removeSpecialChars(plugin.instance)]: {
          condition: "service_healthy",
        },
      },
    };

    this.addService(createBuckets.container_name, createBuckets);
  }

  // Adds the pgadmin service to the docker-compose file
  public async addPGAdmin(plugin: IStatelessPlugin, postgres: string): Promise<void> {
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');
    const isPostgresExternal = getConfig('isPostgresExternal');

    const pgadmin: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'always',
      image: 'dpage/pgadmin4',
      ports: [
        `${port_number}:80`
      ],
      env_file: [
        `${plugin.path}/.env.generated`
      ]
    };

    if (postgres && postgres !== '' && isPostgresExternal === 0) {
      pgadmin.depends_on = {};
      pgadmin.depends_on[`${removeSpecialChars(postgres)}`] = {
        condition: 'service_healthy'
      }
    }

    this.addService(plugin.instance, pgadmin);
  }

  // Adds the storybook services to the docker-compose file
  public async addStorybook(plugin: IStatelessPlugin) {
    const name: string = plugin.instance;
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');
    const bindingPath: string = join(plugin.path, '..');

    if (
      !await fileExists(`${plugin.path}/.env.generated`) ||
      !await fileExists(`${plugin.path}/Dockerfile`)
    ) {
      return;
    }

    const service: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'always',
      build: plugin.path,
      ports: [
        `${port_number}:9000`
      ],
      volumes: [
        `${bindingPath}:/gluestack`,
        `/gluestack/${name}/node_modules`
      ],
      env_file: [
        `${plugin.path}/.env.generated`
      ]
    };

    this.addService(name, service);
  }

  // Adds the other services to the docker-compose file
  public async addOthers(plugin: IStatelessPlugin) {
    const name: string = plugin.instance;

    if (
      !await fileExists(`${plugin.path}/.env.generated`) ||
      !await fileExists(`${plugin.path}/Dockerfile`)
    ) {
      return;
    }

    const service: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'always',
      build: plugin.path,
      volumes: [
        `${plugin.path}:/server`,
        `/server/node_modules`
      ],
      env_file: [
        `${plugin.path}/.env.generated`
      ]
    };

    this.addService(name, service);
  }

  // Executes the docker-compose up cli
  public async start(projectName: string, filepath: string) {
    await execute('docker', [
      'compose',
      '-p',
      projectName,
      'up',
      '--remove-orphans',
      '-d'
    ], {
      cwd: join(filepath),
      stdio: 'inherit',
      shell: true
    });
  }

  // Executes the docker-compose build cli
  public async build(projectName: string, filepath: string) {
    await execute('docker', [
      'compose',
      '-p',
      projectName,
      'build',
      '--no-cache'
    ], {
      cwd: join(filepath),
      stdio: 'inherit',
      shell: true
    });
  }

  // Executes the docker-compose down cli
  public async stop(projectName: string, filepath: string) {
    await execute('docker', [
      'compose',
      '-p',
      projectName,
      'down',
      '--volumes'
    ], {
      cwd: filepath,
      stdio: 'inherit',
      shell: true
    });
  }
}
