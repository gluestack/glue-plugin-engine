import colors from "colors";
import Table from "cli-table3";
import { join } from "node:path";

import { GlueStackPlugin } from "src";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { fileExists } from "../helpers/file-exists";
import { addForwardSlash } from "../helpers/add-forward-slash";

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

  // instantiate
  const table = new Table({
    head: [colors.green('Plugin Prefix Route'), colors.green('URI Route'), colors.green('URI Method')],
    chars: {
      'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
      , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
      , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
      , 'right': '║', 'right-mid': '╢', 'middle': '│'
    }
  });

  for (const instance of upInstances) {
    const paths: string[] = [];

    if (instance && instance?.containerController) {
      try {

        const isService: boolean =
          // @ts-ignore
          instance.callerPlugin.getName() === '@gluestack/glue-plugin-service-node';

        const routerPath: string = join(
          process.cwd(),
          // @ts-ignore
          instance.getInstallationPath(),
          "router.js",
        );

        if (!await fileExists(routerPath)) {
          continue;
        }

        const content = require(routerPath)();
        if (!content.length) {
          continue;
        }

        for (const data of content) {
          if (data.hasOwnProperty("path") && data.path.includes('(.*)')) {
            paths.push(data.path);
          }

          if (data.hasOwnProperty("path") && !data.path.includes('(.*)')) {
            table.push([
              data.path,
              data.proxy.path,
              '--'
            ]);
          }
        }

        if (typeof instance.containerController.getRoutes !== 'function') {
          continue;
        }

        const routes: IRoutes[] = await instance.containerController.getRoutes();
        if (!routes.length) {
          continue;
        }

        let pluginData: any;
        const subRoutes: string[] = [];
        const subMethods: string[] = [];
        for (const _path of paths) {

          pluginData = _path.replace('(.*)', '');
          for (const route of routes) {

            const _routePath = addForwardSlash(route.path);
            if (subRoutes.includes(_routePath)) {
              continue;
            }

            subRoutes.push(_routePath);
            if (isService) {
              subMethods.push('ALL');
            } else {
              subMethods.push(route.method);
            }
          }

          table.push([
            pluginData,
            subRoutes.join("\n"),
            subMethods.join("\n")
          ]);
        }

        await instance.containerController.getPortNumber();
        await instance.containerController.up();

      } catch (e) {
        console.log(
          `Failed: ${instance.getName()} instance could not be started`,
        );

        console.log("\x1b[33m\nError:\x1b[31m", e.message, "\x1b[0m");
      }
    }
  }

  console.log(table.toString());
}
