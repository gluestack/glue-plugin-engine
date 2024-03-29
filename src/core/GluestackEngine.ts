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
import GluestackRouter from "./GluestackRouter";
import { getConfig, setConfig } from "./GluestackConfig";

import { join } from "path";
import { includes } from "lodash";
import { backendPlugins, noDockerfiles } from "../configs/constants";
import {
  writeFile,
  removeSpecialChars,
  getOSFolders,
  fileExists,
} from "@gluestack/helpers";

import { replaceKeyword } from "../helpers/replace-keyword";
import { replaceDirectoryName } from "../helpers/replace-directory-name";
import {
  isValidGluePlugin,
  isDaprService,
  isGlueService,
} from "../helpers/valid-glue-service";
import { execute } from "../helpers/spawn";

/**
 * Gluestack Engine
 *
 * This class is responsible for starting and stopping all the backend
 * plugins and their instances.
 */
export default class GluestackEngine implements IGlueEngine {
  private isProd: boolean;
  private isUpdate: boolean;
  private shouldRestart: boolean;
  private backendPlugins: string[];

  app: IApp;
  actionPlugins: IStatelessPlugin[];
  statelessPlugins: IStatelessPlugin[];
  devonlyPlugins: IStatelessPlugin[];

  constructor(app: IApp, backendInstancePath: string) {
    this.actionPlugins = [];
    this.devonlyPlugins = [];
    this.statelessPlugins = [];

    this.isProd = false;
    this.isUpdate = false;
    this.shouldRestart = false;

    this.app = app;
    this.backendPlugins = backendPlugins;

    setConfig("backendInstancePath", backendInstancePath);
  }

  // Starts the engine for the backend instance
  async start(isRun: boolean = false, noCache: boolean = false, isProd: boolean = false): Promise<void> {
    // setting production flag
    this.isProd = isProd;

    // 1. Gets all the instances and sets some config variables
    // 2. Collects their dockerfiles from instances' assets directory
    await this.collectPlugins("stateless", "up");
    await this.collectPlugins("devonly", "up");

    // 3. generates env
    await this.generateRouterJson();

    // 4. generates env
    await this.generateEnv();

    // 5. generates docker-compose file
    await this.createDockerCompose();

    if (noCache) {
      // 6. starts the docker-compose
      await this.startDockerComposeBuild();
    }

    // 7. starts the docker-compose
    await this.startDockerCompose();

    const hasuraPluginName = getConfig("hasuraInstancePath");
    if (hasuraPluginName && hasuraPluginName !== "") {
      const hasuraEngine: IHasuraEngine = new HasuraEngine(this.actionPlugins);

      // 8. runs hasura metadata apply
      await hasuraEngine.applyMigrate();

      // 9. runs hasura metadata apply
      await hasuraEngine.applyMetadata();

      // 10. runs track files into hasura metadata
      await hasuraEngine.applyTracks();

      // 11. runs seed files into hasura engine
      await hasuraEngine.applySeed();

      if (!isRun) {
        // 12. runs hasura metadata export
        await hasuraEngine.exportMetadata();

        // 13. clears & registers all actions
        await hasuraEngine.reapplyActions();

        // 14. clears & registers all events
        await hasuraEngine.reapplyEvents();
      }
    }

    // 15. collects, validates & register crons into gluestack cron
    const cron: IGluestackCron = new GluestackCron();
    await cron.start();

    // 16. print the router endpoints list
    const router = new GluestackRouter();
    await router.listEndpoints();

    // 17. prints the final message
    console.log("\n> Note: ");
    console.log(
      `>  1. In case a table does not exist in Hasura Engine, Gluestack Engine`,
    );
    console.log(`>     will skip the event trigger registration.`);
    console.log(
      `>  2. Gluestack Engine drops all existing event triggers, actions & `,
    );
    console.log(
      `>     custom-types and re-registers them again. (This is to prevent any`,
    );
    console.log(`>     issues with the event trigger, custom types & actions)`);
    console.log(
      `>  3. Gluestack Engine will not drop any existing event triggers, actions`,
    );
    console.log(
      `>     & custom-types that were not registered with or by Gluestack Engine.\n`,
    );
    console.log(
      `>  4. Gluestack Engine will not skip/drop any database events, app events or crons`,
    );
    console.log(`>     which does not hold valid input against the keys.\n`);
  }

  // Updates the engine for the backend instance
  async update(): Promise<void> {
    this.isUpdate = true;

    // 1. Gets all the instances and sets some config variables
    // 2. Collects their dockerfiles from instances' assets directory
    await this.collectPlugins("stateless", "up");
    await this.collectPlugins("devonly", "up");

    // 3. update only hasura engine instance's with latest actions & events
    const hasuraPluginName = getConfig("hasuraInstancePath");
    if (!this.shouldRestart && hasuraPluginName && hasuraPluginName !== "") {
      const hasuraEngine: IHasuraEngine = new HasuraEngine(this.actionPlugins);

      // 3.1. clears & registers all actions
      await hasuraEngine.reapplyActions();

      // 3.2. clears & registers all events
      await hasuraEngine.reapplyEvents();

      // 3.3. prints the final message
      console.log("\n> Note: ");
      console.log(
        `>  1. In case a table does not exist in Hasura Engine, Gluestack Engine`,
      );
      console.log(`>     will skip the event trigger registration.`);
      console.log(
        `>  2. Gluestack Engine drops all existing event triggers, actions & `,
      );
      console.log(
        `>     custom-types and re-registers them again. (This is to prevent any`,
      );
      console.log(
        `>     issues with the event trigger, custom types & actions)`,
      );
      console.log(
        `>  3. Gluestack Engine will not drop any existing event triggers, actions`,
      );
      console.log(
        `>     & custom-types that were not registered with or by Gluestack Engine.\n`,
      );
      console.log(
        `>  4. Gluestack Engine will not skip/drop any database events, app events or crons`,
      );
      console.log(`>     which does not hold valid input against the keys.\n`);
    }

    // 4. restarts everything since some new instance is added
    if (this.shouldRestart) {
      // 4.1. resetting back to default value
      // since we are restarting the instances
      this.isUpdate = false;
      this.shouldRestart = false;

      // 4.2. stops all the instances
      await this.stop();

      // 4.3. restarts all the instances
      await this.start();
    }
  }

  // Stops the engine for the backend instance
  async stop(isRun: boolean = false): Promise<void> {
    process.stdout.write("\u001b[2J\u001b[0;0H");

    // Gather plugins
    await this.collectPlugins("stateless", "down");
    await this.collectPlugins("devonly", "down");

    const hasuraPluginName = getConfig("hasuraInstancePath");
    const hasuraInstanceStatus = getConfig("hasuraInstanceStatus");

    if (!isRun) {
      // Export if and only if -
      //  - hasura was running and
      //  - hasura plugin is available
      if (
        hasuraInstanceStatus === "up" &&
        hasuraPluginName &&
        hasuraPluginName !== ""
      ) {
        // Export Hasura Metadata
        const hasuraEngine: IHasuraEngine = new HasuraEngine(
          this.actionPlugins,
        );
        await hasuraEngine.exportMetadata();
      }
    }

    // Stop docker-compose
    await this.stopDockerCompose();
  }

  // Collects all the stateless plugins and their dockerfiles
  async collectPlugins(
    pluginType: "stateless" | "devonly" = "stateless",
    status: "up" | "down" = "up",
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
        type &&
        type === pluginType &&
        name &&
        validPlugins.includes(name)
      ) {
        try {
          await instance.getContainerController().getPortNumber();
        } catch (err) {}

        // Collects the instance details into the array
        const details: IStatelessPlugin = {
          name,
          type,
          template_folder: instance.callerPlugin.getTemplateFolderPath(),
          instance: instance.getName(),
          path: join(process.cwd(), instance.getInstallationPath()),
          instance_object: instance,
          status: instance.getContainerController().getStatus(),
        };

        if (pluginType === "stateless" && isDaprService(name)) {
          const daprServices: any = getConfig("daprServices");
          daprServices[details.instance] = {
            name: details.name,
            path: details.path,
            instance: details.instance,
            isService: isGlueService(details.name),
          };
          setConfig("daprServices", daprServices);
        }

        // Ignore graphql plugin
        if (!includes(noDockerfiles, details.name)) {
          // Collect the dockerfile & store the context into the instance store
          await this.collectDockerContext(details, instance);
        }

        // store graphql plugin's instance name
        if (details.name === "@gluestack/glue-plugin-graphql") {
          setConfig(
            "hasuraInstanceStatus",
            instance.getContainerController().getStatus(),
          );

          setConfig("hasuraInstancePath", details.instance);
        }

        // store engine plugin's instance name
        if (details.name === "@gluestack/glue-plugin-backend-engine") {
          setConfig("engineInstancePath", details.instance);
        }

        // store auth plugin's instance name
        if (details.name === "@gluestack/glue-plugin-auth") {
          setConfig("authInstancePath", details.instance);
        }

        // store postgres plugin's instance name
        if (details.name === "@gluestack/glue-plugin-postgres") {
          const { instance_object: instance } = details;
          const dbConfig: any = await instance.gluePluginStore.get("db_config");
          if (dbConfig.external && dbConfig.external === true) {
            setConfig("isPostgresExternal", 1);
          }

          setConfig("postgresInstancePath", details.instance);
        }

        // store minio plugin's instance details
        if (details.name === "@gluestack/glue-plugin-minio") {
          const { instance_object: instance } = details;
          const minioConfig: any = await instance.gluePluginStore.get(
            "minio_credentials",
          );
          if (minioConfig.external && minioConfig.external === true) {
            setConfig("isMinioExternal", 1);
          }

          setConfig("minioInstancePath", details.instance);
        }

        // store services plugin's instance details
        if (details.name.startsWith("@gluestack/glue-plugin-service-")) {
          this.actionPlugins.push(details);
        }

        // store nginx plugin's instance details
        if (details.name === "@gluestack/glue-plugin-router-nginx") {
          setConfig("routerInstancePath", details.instance);
          setConfig("routerPluginName", details.name);
          await instance.getContainerController().up();
        }

        if (this.isUpdate && status === "up" && details.status !== status) {
          this.shouldRestart = true;
        }

        details.status = instance.getContainerController().setStatus(status);
        arr.push(details);
      }
    }

    if (pluginType === "stateless") {
      this.statelessPlugins = arr;
    } else {
      this.devonlyPlugins = arr;
    }
  }

  // Creates the docker-compose file
  async createDockerCompose(): Promise<void> {
    const dockerCompose = new DockerCompose();
    const plugins = [...this.statelessPlugins, ...this.devonlyPlugins];

    const hasuraInstancePath: string = getConfig("hasuraInstancePath");
    const postgresInstancePath: string = getConfig("postgresInstancePath");

    // Gather all the availables plugin instances
    for await (const plugin of plugins) {
      // If and only if the instance is postgres plugin
      if (plugin.name === "@gluestack/glue-plugin-postgres") {
        const isPostgresExternal: number = getConfig("isPostgresExternal");
        if (isPostgresExternal === 1) {
          continue;
        }

        await dockerCompose.addPostgres(plugin);
        continue;
      }

      // If and only if the instance is graphql plugin
      if (plugin.name === "@gluestack/glue-plugin-graphql") {
        await dockerCompose.addHasura(plugin, postgresInstancePath);
        continue;
      }

      if (plugin.name === "@gluestack/glue-plugin-router-nginx") {
        await dockerCompose.addNginx(plugin, hasuraInstancePath);
        continue;
      }

      // If and only if the instance is web plugin
      if (plugin.name === "@gluestack/glue-plugin-web") {
        await dockerCompose.addWeb(plugin);
        continue;
      }

      // If and only if the instance is minio plugin
      if (plugin.name === "@gluestack/glue-plugin-minio") {
        const isMinioExternal: number = getConfig("isMinioExternal");
        if (isMinioExternal === 1) {
          continue;
        }

        await dockerCompose.addMinio(plugin);
        continue;
      }

      // if and only if the instance is pgadmin plugin
      if (plugin.name === "@gluestack/glue-plugin-pg-admin") {
        await dockerCompose.addPGAdmin(plugin, postgresInstancePath);
        continue;
      }

      // if and only if the instance is pgadmin plugin
      if (plugin.name === "@gluestack/glue-plugin-storybook") {
        await dockerCompose.addStorybook(plugin);
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
    const filepath: string = join(process.cwd(), "meta/router");

    // constructing project name for docker compose command
    const folders: string[] = await getOSFolders();
    const projectName: string = folders[folders.length - 1];

    // starting docker compose
    const dockerCompose = new DockerCompose();
    await dockerCompose.start(projectName, filepath);
  }

  async startDockerComposeBuild(): Promise<void> {
    // constructing the path to engine's router
    const filepath: string = join(process.cwd(), "meta/router");

    // constructing project name for docker compose command
    const folders: string[] = await getOSFolders();
    const projectName: string = folders[folders.length - 1];

    // starting docker compose
    const dockerCompose = new DockerCompose();
    await dockerCompose.build(projectName, filepath);
  }

  // Stops the docker-compose
  async stopDockerCompose(): Promise<void> {
    const filepath: string = join(process.cwd(), "meta/router");

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
    instance: IInstance,
  ): Promise<void> {
    // @ts-ignore
    let dockerfile = join(
      process.cwd(),
      "node_modules",
      instance.callerPlugin.getName(),
      this.isProd ? "src/assets/Dockerfile.prod" : "src/assets/Dockerfile",
    );

    if (this.isProd && !(await fileExists(dockerfile))) {
      console.log(
        `> Could not find Dockerfile [Since UP MODE required PRODUCTION Dockerfile] for plugin "${instance.callerPlugin.getName()}" instance "${instance.getName()}". Looking back for Dockerfile...`,
      );

      dockerfile = join(
        process.cwd(),
        "node_modules",
        instance.callerPlugin.getName(),
        "src/assets/Dockerfile",
      );
    }

    if (!(await fileExists(dockerfile))) {
      console.log(
        `> Could not find Dockerfile for plugin "${instance.callerPlugin.getName()}" instance "${instance.getName()}". Skipping...`,
      );
      return;
    }

    // @ts-ignore
    let context = await replaceKeyword(
      dockerfile,
      removeSpecialChars(instance.getName()),
      "{APP_ID}",
    );
    await writeFile(join(details.path, "Dockerfile"), context);

    // @ts-ignore
    context = await replaceKeyword(
      join(details.path, "Dockerfile"),
      replaceDirectoryName(instance.getName()),
      "{INSTANCE_NAME}",
    );

    await writeFile(join(details.path, "Dockerfile"), context);
  }

  // runs env:generate command
  async generateEnv() {
    let args: string[] = ["glue", "env:generate"];

    await execute("node", args, {
      cwd: process.cwd(),
      shell: true,
    });
  }

  // runs route:generate command
  async generateRouterJson() {
    let args: string[] = ["glue", "route:generate"];

    await execute("node", args, {
      cwd: process.cwd(),
      shell: true,
    });
  }
}
