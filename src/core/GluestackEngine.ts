import { join } from "path";
import { DockerCompose } from "./DockerCompose";
import { writeFile } from "../helpers/write-file";
import { replaceKeyword } from "../helpers/replace-keyword";

import { IStatelessPlugin } from "./types/IStatelessPlugin";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import NginxConf from "./NginxConf";
import { IGlueEngine } from "./types/IGlueEngine";

export default class GluestackEngine implements IGlueEngine {
  private backendPlugins: string[];
  private engineExist: boolean = false;

  app: IApp;
  statelessPlugins: IStatelessPlugin[];

  constructor(app: IApp) {
    this.app = app;
    this.backendPlugins = [
      '@gluestack/glue-plugin-engine',
      '@gluestack/glue-plugin-graphql',
      '@gluestack/glue-plugin-functions'
    ];
  }

  // Starts the engine for the backend instance
  async start(backendInstancePath: string) {
    /**
     * 1. Get all the stateless instances
     * 2. Collect dockerfile from all available
     * stateles instances assets directory
     */
    await this.collectDockerfiles();

    // 3. generate docker-compose file
    await this.createDockerCompose(backendInstancePath);

    // 4. generate nginx config
    await this.createNginxConfig(backendInstancePath);

    // 5. start the docker-compose
    if (this.engineExist) {
      await this.startDockerCompose(backendInstancePath);
    } else {
      console.log('> Engine does not exist. Skipping docker-compose start.');
    }
  }

  // Stops the engine for the backend instance
  async stop(backendInstancePath: string) {
    this.stopDockerCompose(backendInstancePath);
  }

  /**
   * Collects all the stateless plugins
   * and their dockerfiles
   */
  async collectDockerfiles () {
    const app: IApp = this.app;
    const arr: IStatelessPlugin[] = [];

    // Gather all the availables plugin instances
    const instances: any = app.getContainerTypePluginInstances(false);

    // Iterate over the instances
    for await (const instance of instances) {

      // Get the type of the instance
      const type: string | undefined = instance?.callerPlugin.getType();
      const name: string | undefined = instance?.callerPlugin.getName();

      // If and only if the instance is a "stateless" + "backend" plugin
      if (
        instance &&
        instance?.containerController &&
        type && type === 'stateless' &&
        name && this.backendPlugins.includes(name)
      ) {

        // Collects the instance details into the array
        const details: IStatelessPlugin = {
          name,
          type,
          template_folder: instance.callerPlugin.getTemplateFolderPath(),
          instance: instance.getName(),
          path: join(process.cwd(), instance.getInstallationPath()),
          status: instance.getContainerController().getStatus()
        };

        if (![
          '@gluestack/glue-plugin-graphql'
        ].includes(details.name)) {
          // Collect the dockerfile & store the context into the instance store
          await this.collectDockerContext(details, instance);
        }

        arr.push(details);
      }
    }

    this.statelessPlugins = arr;
  }

  // Collects the dockerfile of the plugin
  private async collectDockerContext(
    details: IStatelessPlugin,
    instance: IInstance
  ) {
    // @ts-ignore
    const dockerfile = join(
      process.cwd(),
      'node_modules',
      instance.callerPlugin.getName(),
      'src/assets/Dockerfile'
    );

    // @ts-ignore
    const context = await replaceKeyword(
      dockerfile,
      instance.getName(),
      '{APP_ID}'
    );

    await writeFile(join(details.path, 'Dockerfile'), context);
  }

  // Creates the docker-compose file
  async createDockerCompose(backendInstancePath: string) {
    const dockerCompose = new DockerCompose(backendInstancePath);
    const plugins = this.statelessPlugins;

    // Gather all the availables plugin instances
    for await (const plugin of plugins) {
      // If and only if the instance is graphql plugin
      if (plugin.name === '@gluestack/glue-plugin-graphql') {
        dockerCompose.addHasura(plugin);
        continue;
      }

      // If and only if the instance is engine plugin
      if (plugin.name === '@gluestack/glue-plugin-engine') {
        this.engineExist = true;
        dockerCompose.addNginx(plugin);
      }

      // Add the rest of the plugins
      dockerCompose.addOthers(plugin);
    }

    await dockerCompose.generate();
  }

  // Creates the nginx config from all available plugins' router.js file
  async createNginxConfig(backendInstancePath: string) {
    const plugins = this.statelessPlugins;
    const nginxConf = new NginxConf(backendInstancePath);

    nginxConf.addRouter(join(process.cwd(), backendInstancePath, 'router.js'));

    for await (const plugin of plugins) {
      await nginxConf.addRouter(
        join(plugin.path, 'router.js')
      );
    }

    await nginxConf.generate();
  }

  // Starts the docker-compose
  async startDockerCompose(backendInstancePath: string) {
    // constructing the path to engine's router
    const filepath = join(
      process.cwd(),
      backendInstancePath,
      'engine/router'
    );

    // constructing project name for docker compose command
    const folders = process.cwd().split('/');
    const lastFolder = folders[folders.length - 1];
    const projectName = `${lastFolder}_${backendInstancePath}`;

    // starting docker compose
    const dockerCompose = new DockerCompose(backendInstancePath);
    await dockerCompose.start(projectName, filepath);
  }

  // Stops the docker-compose
  async stopDockerCompose(backendInstancePath: string) {
    // constructing the path to engine's router
    const filepath = join(
      process.cwd(),
      backendInstancePath,
      'engine/router'
    );

    // constructing project name for docker compose command
    const folders = process.cwd().split('/');
    const lastFolder = folders[folders.length - 1];
    const projectName = `${lastFolder}_${backendInstancePath}`;

    // starting docker compose
    const dockerCompose = new DockerCompose(backendInstancePath);
    await dockerCompose.stop(projectName, filepath);
  }
}
