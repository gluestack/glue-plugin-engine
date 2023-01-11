import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";

import { IGlueEngine } from "./types/IGlueEngine";
import { IStatelessPlugin } from "./types/IStatelessPlugin";

import NginxConf from "./NginxConf";
import HasuraEngine from "./HasuraEngine";
import DockerCompose from "./DockerCompose";
import { getConfig, setConfig } from "./GluestackConfig";

import { join } from "path";
import { writeFile } from "../helpers/write-file";
import { backendPlugins } from "../configs/constants";
import { waitInSeconds } from "../helpers/wait-in-seconds";
import { replaceKeyword } from "../helpers/replace-keyword";
import { removeSpecialChars } from "../helpers/remove-special-chars";
import { IHasuraEngine } from "./types/IHasuraEngine";

/**
 * Gluestack Engine
 *
 * This class is responsible for starting and stopping all the backend
 * plugins and their instances.
 */
export default class GluestackEngine implements IGlueEngine {
  private backendPlugins: string[];
  private engineExist: boolean = false;

  app: IApp;
  actionPlugins: IStatelessPlugin[];
  statelessPlugins: IStatelessPlugin[];

  constructor(app: IApp, backendInstancePath: string) {
    this.app = app;
    this.actionPlugins = [];
    this.backendPlugins = backendPlugins();

    setConfig('backendInstancePath', backendInstancePath);
  }

  // Starts the engine for the backend instance
  async start(): Promise<void> {
    const backendInstancePath: string = getConfig('backendInstancePath');

    /**
     * 1. Get all the stateless instances
     * 2. Collect dockerfile from all available
     * stateles instances assets directory
     */
    await this.collectPlugins();

    // 3. generate docker-compose file
    await this.createDockerCompose();

    // 4. generate nginx config
    await this.createNginxConfig();

    // 5. start the docker-compose
    if (this.engineExist) {
      await this.startDockerCompose();
    } else {
      console.log('> Engine does not exist. Skipping docker-compose start.');
    }

    const hasuraPluginName = getConfig('hasuraInstancePath');
    if (hasuraPluginName && hasuraPluginName !== '') {
      const hasuraEngine: IHasuraEngine = new HasuraEngine(this.actionPlugins);
      // 6. run hasura metadata apply
      await hasuraEngine.applyMigrate();

      // if auth plugin is available
      // run track file

      // 7. run hasura metadata apply
      await hasuraEngine.applyMetadata();

      // 8. run hasura metadata export
      await hasuraEngine.exportMetadata();

      // 8. clears & registers all actions
      await hasuraEngine.reapplyActions();

      // 9. clears & registers all events
      await hasuraEngine.reapplyEvents();

      console.log('\n> Note: ');
      console.log(`>  1. In case a table does not exist in Hasura Engine, Gluestack Engine will skip the event trigger registration.`);
      console.log(`>  2. Gluestack Engine drops all existing event triggers, actions & custom-types and re-registers them again.`);
      console.log(`      (This is to prevent any issues with the event trigger, custom types & actions.`);
      console.log(`>  3. Gluestack Engine will not drop any existing event triggers, actions & custom-types that are not registered by Gluestack Engine.\n `);
    }
  }

  // Stops the engine for the backend instance
  async stop(): Promise<void> {
    this.stopDockerCompose();
  }

  // Creates the nginx config from all available plugins' router.js file
  async createNginxConfig(): Promise<void> {
    const backendInstancePath: string = getConfig('backendInstancePath');

    const plugins = this.statelessPlugins;
    const nginxConf = new NginxConf();

    nginxConf.addRouter(join(process.cwd(), backendInstancePath, 'router.js'));

    for await (const plugin of plugins) {
      await nginxConf.addRouter(
        join(plugin.path, 'router.js')
      );
    }

    await nginxConf.generate();
  }

  // Collects all the stateless plugins and their dockerfiles
  async collectPlugins (): Promise<void> {
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

        // Ignore graphql plugin
        if (details.name !== '@gluestack/glue-plugin-graphql') {
          // Collect the dockerfile & store the context into the instance store
          await this.collectDockerContext(details, instance);
        } else {
          setConfig('hasuraInstancePath', details.instance);
        }

        if (details.name !== '@gluestack/glue-plugin-engine') {
          setConfig('engineInstancePath', details.instance);
        }

        if (details.name === '@gluestack/glue-plugin-functions.action') {
          this.actionPlugins.push(details);
        }

        arr.push(details);
      }
    }

    this.statelessPlugins = arr;
  }

  // Creates the docker-compose file
  async createDockerCompose(): Promise<void> {
    const dockerCompose = new DockerCompose();
    const plugins = this.statelessPlugins;

    // Gather all the availables plugin instances
    for await (const plugin of plugins) {
      // If and only if the instance is graphql plugin
      if (plugin.name === '@gluestack/glue-plugin-graphql') {
        dockerCompose.addHasura(plugin);
        setConfig('hasuraInstancePath', plugin.instance);

        continue;
      }

      // If and only if the instance is engine plugin
      if (plugin.name === '@gluestack/glue-plugin-engine') {
        this.engineExist = true;
        dockerCompose.addNginx(plugin);

        setConfig('engineInstancePath', plugin.instance);
      }

      // Add the rest of the plugins
      dockerCompose.addOthers(plugin);
    }

    await dockerCompose.generate();
  }

  // Starts the docker-compose
  async startDockerCompose(): Promise<void> {
    const backendInstancePath: string = getConfig('backendInstancePath');

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
    const dockerCompose = new DockerCompose();
    await dockerCompose.start(projectName, filepath);

    // wait for 2 seconds for hasura to get ready
    await waitInSeconds(2);
  }

  // Stops the docker-compose
  async stopDockerCompose(): Promise<void> {
    const backendInstancePath: string = getConfig('backendInstancePath');

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
    const dockerCompose = new DockerCompose();
    await dockerCompose.stop(projectName, filepath);
  }

  // Collects the dockerfile of the plugin
  private async collectDockerContext(
    details: IStatelessPlugin,
    instance: IInstance
  ): Promise<void> {
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
      removeSpecialChars(instance.getName()),
      '{APP_ID}'
    );

    await writeFile(join(details.path, 'Dockerfile'), context);
  }
}
