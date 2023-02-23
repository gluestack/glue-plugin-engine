const services = require("@gluestack/framework/constants/services");

import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

import { IGlueEngine } from "./types/IGlueEngine";
import { IHasuraEngine } from "./types/IHasuraEngine";
import { IGluestackCron } from "./types/IGluestackCron";
import { IStatelessPlugin } from "./types/IStatelessPlugin";

import HasuraEngine from "./HasuraEngine";
import GluestackCron from "./GluestackCron";
import DockerCompose from "./DockerCompose";
import { getConfig, setConfig } from "./GluestackConfig";

import { join } from "path";
import { includes } from "lodash";
import { backendPlugins, noDockerfiles } from "../configs/constants";
import { writeFile, removeSpecialChars, getOSFolders, waitInSeconds, fileExists } from "@gluestack/helpers";

import { replaceKeyword } from "../helpers/replace-keyword";
import { isValidGluePlugin, isDaprService, isGlueService } from "../helpers/valid-glue-service";

/**
 * Gluestack Engine
 *
 * This class is responsible for starting and stopping all the backend
 * plugins and their instances.
 */
export default class GluestackEngine implements IGlueEngine {
  private backendPlugins: string[];

  app: IApp;
  actionPlugins: IStatelessPlugin[];
  statelessPlugins: IStatelessPlugin[];
  devonlyPlugins: IStatelessPlugin[];

  constructor(app: IApp, backendInstancePath: string) {
    this.actionPlugins = [];
    this.devonlyPlugins = [];
    this.statelessPlugins = [];

    this.app = app;
    this.backendPlugins = backendPlugins;

    setConfig('backendInstancePath', backendInstancePath);
  }

  // Starts the engine for the backend instance
  async start(): Promise<void> {
    // 1. Gets all the instances and sets some config variables
    // 2. Collects their dockerfiles from instances' assets directory
    await this.collectPlugins('stateless', 'up');
    await this.collectPlugins('devonly', 'up');

    // 3. generates docker-compose file
    await this.createDockerCompose();

    // 4. starts the docker-compose
    await this.startDockerCompose();

    const hasuraPluginName = getConfig('hasuraInstancePath');
    if (hasuraPluginName && hasuraPluginName !== '') {
      const hasuraEngine: IHasuraEngine = new HasuraEngine(this.actionPlugins);

      // 5. runs hasura metadata apply
      await hasuraEngine.applyMigrate();

      // 6. runs hasura metadata apply
      await hasuraEngine.applyMetadata();

      // 7. runs track files into hasura metadata
      await hasuraEngine.applyTracks();

      // 8. runs seed files into hasura engine
      await hasuraEngine.applySeed();

      // 9. runs hasura metadata export
      await hasuraEngine.exportMetadata();

      // 10. clears & registers all actions
      await hasuraEngine.reapplyActions();

      // 11. clears & registers all events
      await hasuraEngine.reapplyEvents();
    }

    // 12. collects, validates & register crons into gluestack cron
    const cron: IGluestackCron = new GluestackCron();
    await cron.start();

    console.log('\n> Note: ');
    console.log(`>  1. In case a table does not exist in Hasura Engine, Gluestack Engine`);
    console.log(`>     will skip the event trigger registration.`);
    console.log(`>  2. Gluestack Engine drops all existing event triggers, actions & `);
    console.log(`>     custom-types and re-registers them again. (This is to prevent any`);
    console.log(`>     issues with the event trigger, custom types & actions)`);
    console.log(`>  3. Gluestack Engine will not drop any existing event triggers, actions`);
    console.log(`>     & custom-types that were not registered with or by Gluestack Engine.\n`);
    console.log(`>  4. Gluestack Engine will not skip/drop any database events, app events or crons`);
    console.log(`>     which does not hold valid input against the keys.\n`);
  }

  // Stops the engine for the backend instance
  async stop(): Promise<void> {
    process.stdout.write("\u001b[2J\u001b[0;0H");

    // Gather plugins
    await this.collectPlugins('stateless', 'down');
    await this.collectPlugins('devonly', 'down');

    const hasuraPluginName = getConfig('hasuraInstancePath');
    const hasuraInstanceStatus = getConfig('hasuraInstanceStatus');

    // Export if and only if -
    //  - hasura was running and
    //  - hasura plugin is available
    if (hasuraInstanceStatus === 'up' && hasuraPluginName && hasuraPluginName !== '') {
      // Export Hasura Metadata
      const hasuraEngine: IHasuraEngine = new HasuraEngine(this.actionPlugins);
      await hasuraEngine.exportMetadata();
    }

    // Stop docker-compose
    await this.stopDockerCompose();
  }

  // Collects all the stateless plugins and their dockerfiles
  async collectPlugins(
    pluginType: 'stateless' | 'devonly' = 'stateless',
    status: 'up' | 'down' = 'up'
  ): Promise<void> {
    const app: IApp = this.app;
    const arr: IStatelessPlugin[] = [];

    // Gather all the availables plugin instances
    // @ts-ignore
    const instances: (IInstance & IHasContainerController)[] =
      app.getContainerTypePluginInstances(false);

    const validPlugins: string[] = [];

    // Iterate over the instances
    for await (const instance of instances) {

      // Get the type of the instance
      const type: string | undefined = instance?.callerPlugin.getType();
      const name: string | undefined = instance?.callerPlugin.getName();

      validPlugins.push(...isValidGluePlugin(this.backendPlugins, name));

      // If and only if the instance is a "stateless" + "backend" plugin
      if (
        instance &&
        instance?.containerController &&
        type && type === pluginType &&
        name && validPlugins.includes(name)
      ) {

        try {
          await instance.getContainerController().getPortNumber();
        } catch (err) {
        }

        // Collects the instance details into the array
        const details: IStatelessPlugin = {
          name,
          type,
          template_folder: instance.callerPlugin.getTemplateFolderPath(),
          instance: instance.getName(),
          path: join(process.cwd(), instance.getInstallationPath()),
          instance_object: instance
        };

        if (pluginType === 'stateless' && isDaprService(name)) {
          const daprServices: any = getConfig('daprServices');
          daprServices[details.instance] = {
            name: details.name,
            path: details.path,
            instance: details.instance,
            isService: isGlueService(details.name)
          };
          setConfig('daprServices', daprServices);
        }

        // Ignore graphql plugin
        if (!includes(noDockerfiles, details.name)) {
          // Collect the dockerfile & store the context into the instance store
          await this.collectDockerContext(details, instance);
        }

        // store graphql plugin's instance name
        if (details.name === '@gluestack/glue-plugin-graphql') {
          setConfig(
            'hasuraInstanceStatus',
            instance.getContainerController().getStatus()
          );

          setConfig('hasuraInstancePath', details.instance);
        }

        // store engine plugin's instance name
        if (details.name === '@gluestack/glue-plugin-backend-engine') {
          setConfig('engineInstancePath', details.instance);
        }

        // store auth plugin's instance name
        if (details.name === '@gluestack/glue-plugin-auth') {
          setConfig('authInstancePath', details.instance);
        }

        // store postgres plugin's instance name
        if (details.name === '@gluestack/glue-plugin-postgres') {
          const { instance_object: instance } = details;
          const dbConfig: any = await instance.gluePluginStore.get('db_config');
          if (dbConfig.external && dbConfig.external === true) {
            setConfig('isPostgresExternal', 1);
          }

          setConfig('postgresInstancePath', details.instance);
        }

        // store minio plugin's instance details
        if (details.name === '@gluestack/glue-plugin-minio') {
          const { instance_object: instance } = details;
          const minioConfig: any = await instance.gluePluginStore.get('minio_credentials');
          if (minioConfig.external && minioConfig.external === true) {
            setConfig('isMinioExternal', 1);
          }

          setConfig('minioInstancePath', details.instance);
        }

        // store services plugin's instance details
        if (details.name.startsWith('@gluestack/glue-plugin-service-')) {
          this.actionPlugins.push(details);
        }

        // store nginx plugin's instance details
        if (details.name === '@gluestack/glue-plugin-router-nginx') {
          await instance.getContainerController().up();
        }

        details.status = instance.getContainerController().setStatus(status);
        arr.push(details);
      }
    }

    if (pluginType === 'stateless') {
      this.statelessPlugins = arr;
    } else {
      this.devonlyPlugins = arr;
    }
  }

  // Creates the docker-compose file
  async createDockerCompose(): Promise<void> {
    const dockerCompose = new DockerCompose();
    const plugins = [
      ...this.statelessPlugins,
      ...this.devonlyPlugins
    ];

    const hasuraInstancePath: string = getConfig('hasuraInstancePath');
    const postgresInstancePath: string = getConfig('postgresInstancePath');

    // Gather all the availables plugin instances
    for await (const plugin of plugins) {
      // If and only if the instance is postgres plugin
      if (plugin.name === '@gluestack/glue-plugin-postgres') {
        const isPostgresExternal: number = getConfig('isPostgresExternal');
        if (isPostgresExternal === 1) {
          continue;
        }

        await dockerCompose.addPostgres(plugin);
        continue;
      }

      // If and only if the instance is graphql plugin
      if (plugin.name === '@gluestack/glue-plugin-graphql') {
        await dockerCompose.addHasura(plugin, postgresInstancePath);
        continue;
      }

      if (plugin.name === '@gluestack/glue-plugin-router-nginx') {
        await dockerCompose.addNginx(plugin, hasuraInstancePath);
        continue;
      }

      // If and only if the instance is web plugin
      if (plugin.name === '@gluestack/glue-plugin-web') {
        await dockerCompose.addWeb(plugin);
        continue;
      }

      // If and only if the instance is minio plugin
      if (plugin.name === '@gluestack/glue-plugin-minio') {
        const isMinioExternal: number = getConfig('isMinioExternal');
        if (isMinioExternal === 1) {
          continue;
        }

        await dockerCompose.addMinio(plugin);
        continue;
      }

      // if and only if the instance is pgadmin plugin
      if (plugin.name === '@gluestack/glue-plugin-pg-admin') {
        await dockerCompose.addPGAdmin(plugin, postgresInstancePath);
        continue;
      }

      // Add the rest of the plugins
      await dockerCompose.addOthers(plugin);
    }

    await dockerCompose.generate();
  }

  // Starts the docker-compose
  async startDockerCompose(): Promise<void> {
    // constructing the path to engine's router
    const filepath: string = join(process.cwd(), 'meta/router');

    // constructing project name for docker compose command
    const folders: string[] = await getOSFolders();
    const projectName: string = folders[folders.length - 1];

    // starting docker compose
    const dockerCompose = new DockerCompose();
    await dockerCompose.start(projectName, filepath);
  }

  // Stops the docker-compose
  async stopDockerCompose(): Promise<void> {
    const filepath: string = join(process.cwd(), 'meta/router');

    // constructing project name for docker compose command
    const folders: string[] = await getOSFolders();
    const projectName: string = folders[folders.length - 1];

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

    if (!await fileExists(dockerfile)) {
      console.log(`> Could not find Dockerfile for plugin "${instance.callerPlugin.getName()}" instance "${instance.getName()}". Ingoring...`);
      return;
    }

    // @ts-ignore
    let context = await replaceKeyword(
      dockerfile,
      removeSpecialChars(instance.getName()),
      '{APP_ID}'
    );
    await writeFile(join(details.path, 'Dockerfile'), context);

    // @ts-ignore
    context = await replaceKeyword(
      join(details.path, 'Dockerfile'),
      removeSpecialChars(instance.getName()),
      '{INSTANCE_NAME}'
    );

    await writeFile(join(details.path, 'Dockerfile'), context);
  }
}
