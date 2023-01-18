import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

import { IGlueEngine } from "./types/IGlueEngine";
import { IStatelessPlugin } from "./types/IStatelessPlugin";

import NginxConf from "./NginxConf";
import HasuraEngine from "./HasuraEngine";
import GluestackCron from "./GluestackCron";
import DockerCompose from "./DockerCompose";
import { getConfig, setConfig } from "./GluestackConfig";

import { join } from "path";
import { includes } from "lodash";
import { writeFile } from "../helpers/write-file";
import { backendPlugins, noDockerfiles } from "../configs/constants";
import { waitInSeconds } from "../helpers/wait-in-seconds";
import { replaceKeyword } from "../helpers/replace-keyword";
import { removeSpecialChars } from "../helpers/remove-special-chars";

import { IHasuraEngine } from "./types/IHasuraEngine";
import { IGluestackCron } from "./types/IGluestackCron";

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
  statefulPlugins: IStatelessPlugin[];

  constructor(app: IApp, backendInstancePath: string) {
    this.actionPlugins = [];
    this.statefulPlugins = [];
    this.statelessPlugins = [];

    this.app = app;
    this.backendPlugins = backendPlugins;

    setConfig('backendInstancePath', backendInstancePath);
  }

  // Starts the engine for the backend instance
  async start(): Promise<void> {
    // 1. Gets all the stateless instances and sets some config variables
    // 2. Collect dockerfile from all available stateles instances assets directory
    await this.collectPlugins('stateless');
    await this.collectPlugins('stateful');

    // 3. generates docker-compose file
    await this.createDockerCompose();

    // 4. generates nginx config
    await this.createNginxConfig();

    // 5. starts the docker-compose
    if (this.engineExist) {
      await this.startDockerCompose();
    } else {
      console.log('> Engine does not exist. Skipping docker-compose start.');
    }

    const hasuraPluginName = getConfig('hasuraInstancePath');
    if (hasuraPluginName && hasuraPluginName !== '') {
      const hasuraEngine: IHasuraEngine = new HasuraEngine(this.actionPlugins);

      // 6. runs hasura metadata apply
      await hasuraEngine.applyMigrate();

      // 7. runs hasura metadata apply
      await hasuraEngine.applyMetadata();

      // 8. runs track files into hasura metadata
      await hasuraEngine.applyTracks();

      // 9. runs hasura metadata export
      await hasuraEngine.exportMetadata();

      // 10. clears & registers all actions
      await hasuraEngine.reapplyActions();

      // 11. clears & registers all events
      await hasuraEngine.reapplyEvents();

      console.log('\n> Note: ');
      console.log(`>  1. In case a table does not exist in Hasura Engine, Gluestack Engine`);
      console.log(`>     will skip the event trigger registration.`);
      console.log(`>  2. Gluestack Engine drops all existing event triggers, actions & `);
      console.log(`>     custom-types and re-registers them again. (This is to prevent any`);
      console.log(`>     issues with the event trigger, custom types & actions)`);
      console.log(`>  3. Gluestack Engine will not drop any existing event triggers, actions`);
      console.log(`>     & custom-types that are not registered by Gluestack Engine.\n`);
    }

    // 12. collects, validates & register crons into gluestack cron
    const cron: IGluestackCron = new GluestackCron();
    await cron.start();
  }

  // Stops the engine for the backend instance
  async stop(): Promise<void> {
    // Gather plugins
    this.collectPlugins();

    // Stop docker-compose
    this.stopDockerCompose();

    // Export Hasura Metadata
    const hasuraPluginName = getConfig('hasuraInstancePath');
    if (hasuraPluginName && hasuraPluginName !== '') {
      const hasuraEngine: IHasuraEngine = new HasuraEngine(this.actionPlugins);
      await hasuraEngine.exportMetadata();
    }
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
  async collectPlugins (
    pluginType: 'stateless' | 'stateful' = 'stateless'
  ): Promise<void> {
    const app: IApp = this.app;
    const arr: IStatelessPlugin[] = [];

    // Gather all the availables plugin instances
    // @ts-ignore
    const instances: (IInstance & IHasContainerController)[] =
      app.getContainerTypePluginInstances(false);

    // Iterate over the instances
    for await (const instance of instances) {

      // Get the type of the instance
      const type: string | undefined = instance?.callerPlugin.getType();
      const name: string | undefined = instance?.callerPlugin.getName();

      // If and only if the instance is a "stateless" + "backend" plugin
      if (
        instance &&
        instance?.containerController &&
        type && type === pluginType &&
        name && this.backendPlugins.includes(name)
      ) {

        // Collects the instance details into the array
        const details: IStatelessPlugin = {
          name,
          type,
          template_folder: instance.callerPlugin.getTemplateFolderPath(),
          instance: instance.getName(),
          path: join(process.cwd(), instance.getInstallationPath()),
          status: instance.getContainerController().setStatus('up'),
          instance_object: instance
        };

        // Ignore graphql plugin
        if (!includes(noDockerfiles, details.name)) {
          // Collect the dockerfile & store the context into the instance store
          await this.collectDockerContext(details, instance);
        }

        // store graphql plugin's instance name
        if (details.name === '@gluestack/glue-plugin-graphql') {
          setConfig('hasuraInstancePath', details.instance);
        }

        // store engine plugin's instance name
        if (details.name === '@gluestack/glue-plugin-engine') {
          setConfig('engineInstancePath', details.instance);
        }

        // store auth plugin's instance name
        if (details.name === '@gluestack/glue-plugin-auth') {
          setConfig('authInstancePath', details.instance);
        }

        // store functions plugin's instance name
        if (details.name === '@gluestack/glue-plugin-functions.action') {
          this.actionPlugins.push(details);
        }

        // store postgres plugin's instance name
        if (details.name === '@gluestack/glue-plugin-postgres') {
          setConfig('postgresInstancePath', details.instance);
        }

        arr.push(details);
      }
    }

    if (pluginType === 'stateless') {
      this.statelessPlugins = arr;
    } else {
      this.statefulPlugins = arr;
    }
  }

  // Creates the docker-compose file
  async createDockerCompose(): Promise<void> {
    const dockerCompose = new DockerCompose();
    const plugins = [
      ...this.statelessPlugins,
      ...this.statefulPlugins
    ];

    const postgresInstancePath: string = getConfig('postgresInstancePath');
    // Gather all the availables plugin instances
    for await (const plugin of plugins) {
      // If and only if the instance is postgres plugin
      if (plugin.name === '@gluestack/glue-plugin-postgres') {
        dockerCompose.addPostgres(plugin);
        continue;
      }

      // If and only if the instance is graphql plugin
      if (plugin.name === '@gluestack/glue-plugin-graphql') {
        dockerCompose.addHasura(plugin, postgresInstancePath);
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
