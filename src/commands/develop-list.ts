import { ConsoleTable } from "@gluestack/helpers";

import { GlueStackPlugin } from "src";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

function isGluePackage(packageName: string, gluePackageName: string): boolean {
  if (packageName === gluePackageName) {
    return true;
  }

  if (gluePackageName.startsWith('@')) {
    // @ts-ignore
    let arr = gluePackageName.split(['/']);
    if (arr[1] && arr[1] === `glue-plugin-${packageName}` || arr[1] === packageName) {
      return true;
    }
  }
  return false;
};

export function developList(program: any, glueStackPlugin: GlueStackPlugin) {
  program
    .command("develop:list")
    .description("Lists all the container instances")
    .option("--filter <package-name>", "Filter the package")
    .action((args: any) => runner(glueStackPlugin, args));
}

export async function runner(glueStackPlugin: GlueStackPlugin, args: any) {
  let i: number = 1;

  const head: string[] = [
    '#',
    'Instance Name',
    'Plugin Name',
    'Plugin Version',
    'Plugin Type',
    'Instance Status',
    'Instance Port',
    // 'Instance Container ID / PID'
  ];

  const rows: any = [];

  glueStackPlugin.app.getContainerTypePluginInstances(false)
    // @ts-ignore
    .filter((instance: IInstance & IHasContainerController) => {
      const packageName = args.filter;
      const instanceName = instance.getName();
      const gluePackageName = instance.callerPlugin.getName();

      if (!packageName && packageName !== "") return instance;

      if (
        packageName
        && instanceName === packageName
        || isGluePackage(packageName, gluePackageName)
      ) {
        return instance
      }
    })
    // @ts-ignore
    .forEach((instance: IInstance & IHasContainerController) => {
      if (instance && instance?.containerController) {
        rows.push([
          i++,
          instance.getName(),
          instance.callerPlugin.getName(),
          instance.callerPlugin.getVersion(),
          instance.callerPlugin.getType(),
          instance.getContainerController().getStatus(),
          instance.getContainerController().getStatus() === "up"
            ? instance.getContainerController().portNumber || "-"
            : "-",
          // instance.getContainerController().getContainerId() || "-",
        ]);
      }
    });

  ConsoleTable.print(
    head,
    rows
  );
}
