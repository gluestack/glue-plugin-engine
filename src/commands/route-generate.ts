import { GlueStackPlugin } from "src";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

import { join } from "path";
import NginxConf from "../helpers/nginx-conf";
import { getDomainMappings } from '../constants';
import { createTree } from "../helpers/create-tree";
import { IStatelessPlugin } from "../types/IStatelessPlugin";

const { fileExists } = require('@gluestack/helpers');

export const routeGenerate = async (program: any, glueStackPlugin: GlueStackPlugin) => {
  program
    .command("route:generate")
    .option("--build <build>", "Generates build based on the platform . Options: 'dev' or 'prod'", "dev")
    .description("Generates router file for all the container instances")
    .action((options: any) => runner(glueStackPlugin, options));
};

export const metaPlugins = async (): Promise<string[]> => {
  const metaPluginsPath: string = join(process.cwd(), 'meta', 'plugins.json');
  if (!await fileExists(metaPluginsPath)) {
    return [];
  }

  const metaInstanceContent: object = require(metaPluginsPath);
  return Object.keys(metaInstanceContent);
};

export const runner = async (glueStackPlugin: GlueStackPlugin, options: any) => {
  const { build } = options;

  const tree: any = {};
  const statelessPlugins: IStatelessPlugin[] = [];
  const app: IApp = glueStackPlugin.app;
  const meta: string[] = await metaPlugins();

  // Gather all the availables plugin instances
  // @ts-ignore
  const instancesAndTree: (IInstance & IHasContainerController)[] =
    app.getContainerTypePluginInstances(false, true);

  // @ts-ignore
  const plugins: any = instancesAndTree.tree;
  // @ts-ignore
  for (const pluginName of Object.keys(plugins)) {
    tree[pluginName] = [];
    for (const instanceName of Object.keys(plugins[pluginName])) {

      const instance = plugins[pluginName][instanceName];
      const packageJSON = join(
        instance.callerPlugin.getTemplateFolderPath(), '..', 'package.json'
      );

      if (!await fileExists(packageJSON)) continue;

      try {
        const peerDependencies = require(packageJSON).peerDependencies;
        for (const dependency of Object.keys(peerDependencies)) {
          if (!meta.includes(dependency)) {
            continue;
          } else {
            tree[pluginName].push(dependency);
          }
        }
      } catch (err) {
        console.log('>> Error:', err);
        continue;
      }
    }
  }

  // fetching plugins at depth level 1
  const dataTree: any = await createTree(tree, 1);
  if (dataTree.length <= 0) {
    console.log('> No package installed, please install at least one stateless or stateful package!');
    process.exit(0);
  }

  const packages: string[] = dataTree.map((node: any) => node.name);

  // @ts-ignore
  const instances: any = instancesAndTree.instances;
  // Iterate over the instances
  for await (const instance of instances) {
    // Get the type of the instance
    const type: string | undefined = instance?.callerPlugin.getType();
    const name: string | undefined = instance?.callerPlugin.getName();

    // If and only if the instance is a "stateless" + "backend" plugin
    if (
      instance && type && name &&
      instance?.containerController &&
      type === 'stateless' && packages.includes(name)
    ) {

      // Collects the instance details into the statelessPlugins
      const details: IStatelessPlugin = {
        name,
        type,
        instance: instance.getName(),
        is_backend: false
      };

      if (name === '@gluestack/glue-plugin-backend-engine') {
        details.path = join(process.cwd(), instance.getInstallationPath(), '..');
        details.is_backend = true;
      } else {
        details.path = join(process.cwd(), instance.getInstallationPath())
      }

      details.status = instance.getContainerController().getStatus();
      details.port = await instance.getContainerController().getPortNumber();

      statelessPlugins.push(details);
    }
  }

  if (build === 'prod') {
    await generateProdRouter(statelessPlugins);
  } else {
    await generateDevRouter(statelessPlugins);
  }

  console.log(JSON.stringify(getDomainMappings()));
};

const generateProdRouter = async (statelessPlugins: IStatelessPlugin[]) => {
  const nginxConf = new NginxConf();

  for await (const plugin of statelessPlugins) {
    await nginxConf.addRouter(
      plugin.name,
      plugin.instance,
      plugin.port,
      join(plugin.path, 'router.js'),
      plugin.is_backend
    );
  }

  await nginxConf.generateProd();
};

const generateDevRouter = async (statelessPlugins: IStatelessPlugin[]) => {
  const nginxConf = new NginxConf();

  for await (const plugin of statelessPlugins) {
    await nginxConf.addRouter(
      plugin.name,
      plugin.instance,
      plugin.port,
      join(plugin.path, 'router.js'),
      false
    );
  }

  await nginxConf.generateDev();
};
