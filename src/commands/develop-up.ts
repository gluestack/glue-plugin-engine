import { GlueStackPlugin } from "src";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import { routesList } from "../helpers/route-list";

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

  await routesList(upInstances, true);
}
