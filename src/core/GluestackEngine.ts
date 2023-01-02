import { join } from "path";
import { DockerCompose } from "./DockerCompose";
import { writeFile } from "../helpers/write-file";
import { replaceKeyword } from "../helpers/replace-keyword";

import { IStatelessPlugin } from "./types/IStatelessPlugin";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import NginxConf from "./NginxConf";

export default class GluestackEngine {
  app: IApp;
  dockerCompose: DockerCompose;
  statelessPlugins: IStatelessPlugin[];
  backendPlugins: string[];

  constructor(app: IApp) {
    this.app = app;
    this.backendPlugins = [
      '@gluestack/glue-plugin-engine',
      '@gluestack/glue-plugin-graphql',
      '@gluestack/glue-plugin-functions'
    ];
  }

  // Collects all the stateless plugins
  // and their dockerfiles
  async collectDockerContext () {
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
          await this.collectDockerfiles(details, instance);
        }

        arr.push(details);
      }
    }

    this.statelessPlugins = arr;
  }

  // Collects the dockerfile of the plugin
  private async collectDockerfiles(
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

  async start() {}

  async stop() {}

  async startDockerCompose() {}

  async stopDockerCompose() {}

  async cleanDockerVolumes() {}
}
