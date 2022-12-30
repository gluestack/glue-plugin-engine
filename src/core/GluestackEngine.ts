import { join } from "path";
import { writeFile } from "../helpers/write-file";
import { replaceKeyword } from "../helpers/replace-keyword";
import { IStatelessPlugin } from "./types/IStatelessPlugin";

import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";

export default class GluestackEngine {
  statelessPlugins: IStatelessPlugin[];
  app: IApp;

  constructor(app: IApp) {
    this.app = app;
  }

  async start() {}

  async stop() {}

  async startDockerCompose() {}

  async stopDockerCompose() {}

  async cleanDockerVolumes() {}

  async collectDockerContext () {
    const app: IApp = this.app;
    const arr: IStatelessPlugin[] = [];

    // Gather all the availables plugin instances
    const instances: any = app.getContainerTypePluginInstances(false);

    // Iterate over the instances
    for await (const instance of instances) {

      // Get the type of the instance
      const type: string | undefined = instance?.callerPlugin.getType();

      // If and only if the instance is a stateless plugin
      if (instance && instance?.containerController && type && type === 'stateless') {

        // Collect the instance details into the array
        const details: IStatelessPlugin = {
          name: instance.callerPlugin.getName(),
          template_folder: instance.callerPlugin.getTemplateFolderPath(),
          instance: instance.getName(),
          path: join(process.cwd(), instance.getInstallationPath()),
          status: instance.getContainerController().getStatus(),
          port:
            instance.getContainerController().getStatus() === "up"
              ? instance.getContainerController().portNumber || "-"
              : "-",
          "container_id/pid":
            instance.getContainerController().getContainerId() || "-",
        };

        // Collect the dockerfile & store the context into the instance store
        await this.collectDockerfiles(details, instance);

        arr.push(details);
      }
    }

    this.statelessPlugins = arr;
  }

  private async collectDockerfiles(details: any, instance: IInstance) {
    // @ts-ignore
    const dockerfile = join(process.cwd(), 'node_modules', instance.callerPlugin.getName(), 'src/assets/Dockerfile');

    // @ts-ignore
    const context = await replaceKeyword(dockerfile, instance.getName(), '{APP_ID}');
    await writeFile(join(details.path, 'Dockerfile'), context);
  }

  async createDockerCompose() {
    const app: IApp = this.app;

    // Gather all the availables plugin instances
    const instances: any = app.getContainerTypePluginInstances(false);
    for await (const instance of instances) {
      // do nothing
    }
  }
}
