import { join } from "node:path";
import { GlueStackPlugin } from "src";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { fileExists } from "../helpers/file-exists";

export function developUp(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("develop:up")
    .argument(
      "[instance-name]",
      "Name of the container instance to up (optional)",
    )
    .description(
      "Starts provided container instances or all the containers if no instance is provided",
    )
    .action((instanceName: string) => runner(instanceName, glueStackPlugin));
}

export async function runner(
  instanceName: string,
  glueStackPlugin: GlueStackPlugin,
) {
  const instances = glueStackPlugin.app.getContainerTypePluginInstances(true);
  let upInstances: (IPlugin & IHasContainerController)[] = instances;
  let found = false;
  if (instanceName) {
    for (const instance of instances) {
      if (instance.getName() === instanceName) {
        found = true;
        upInstances = [instance];
        break;
      }
    }
    if (!found) {
      console.log(`Error: could not up ${instanceName} instance not found`);
      return;
    }
  }

  const routes: IRoutes[] = [];
  for (const instance of upInstances) {
    if (instance && instance?.containerController) {
      try {
        if (typeof instance.containerController.getRoutes === 'function') {
          const routerPath: string = join(
            process.cwd(),
            // @ts-ignore
            instance.getInstallationPath(),
            "router.js",
          );

          const subRoute: string = '';
          if (await fileExists(routerPath)) {
            const content = require(routerPath)();
            if (content.length) {
              // subRoute = content[0].path;
            }
          }

          routes.push(...await instance.containerController.getRoutes());
        }

        await instance.containerController.getPortNumber();
        await instance.containerController.up();
      } catch (e) {
        console.log(
          `Failed: ${instance.getName()} instance could not be started`,
        );

        console.log("\x1b[33m\nError:\x1b[31m", e.message, "\x1b[0m");
      }
      console.log();
    }
  }

  console.table(routes);
}
