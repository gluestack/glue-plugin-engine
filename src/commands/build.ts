import { GlueStackPlugin } from "src";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

export function build(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("build")
    .argument(
      "[instance-name]",
      "Name of the container instance to build (optional)",
    )
    .description(
      "Builds provided container instances or all the containers if no instance is provided",
    )
    .action((instanceName: string) => runner(instanceName, glueStackPlugin));
}

export async function runner(
  instanceName: string,
  glueStackPlugin: GlueStackPlugin,
) {
  const instances = glueStackPlugin.app.getContainerTypePluginInstances(true);
  let buildInstances: (IPlugin & IHasContainerController)[] = instances;
  let found = false;
  if (instanceName) {
    for (const instance of instances) {
      if (instance.getName() === instanceName) {
        found = true;
        buildInstances = [instance];
        break;
      }
    }
    if (!found) {
      console.log(`Error: could not build ${instanceName} instance not found`);
      return;
    }
  }

  for (const instance of buildInstances) {
    if (
      instance &&
      //@ts-ignore
      instance.callerPlugin.getType() === "stateless" &&
      instance?.containerController
    ) {
      console.log(`Building: ${instance.getName()} instance`);
      try {
        await instance.containerController.build();
        console.log(`Success: ${instance.getName()} instance is build`);
      } catch (e) {
        console.log(
          `Failed: ${instance.getName()} instance could not be stopped`,
        );
        console.log("\x1b[33m\nError:\x1b[31m", e.message, "\x1b[0m");
      }
      console.log();
    }
  }
}
