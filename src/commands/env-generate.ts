import { GlueStackPlugin } from "src";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import { join } from "path";
import Env from "../helpers/env";
import { envToJson, fileExists } from "@gluestack/helpers";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IManagesInstances from "@gluestack/framework/types/plugin/interface/IManagesInstances";

export const envGenerate = async (program: any, glueStackPlugin: GlueStackPlugin) => {
  program
    .command("env:generate")
    .option("--build <build>", "Generates env based on the platform . Options: 'dev' or 'prod'", "dev")
    .description("Generates .env.generated for all the instances")
    .action((options: any) => runner(glueStackPlugin, options));
};

export const runner = async (glueStackPlugin: GlueStackPlugin, options: any) => {
  const { build } = options;

  const instances: any[] = [];
  const app: IApp = glueStackPlugin.app;

  // Gather all the available plugin instances
  // @ts-ignore
  const plugins: (IPlugin & IManagesInstances)[] = app.plugins;

  // Iterate over the instances
  for await (const plugin of plugins) {
    for await (const instance of plugin.getInstances()) {
      // Get the type of the instance
      const name: string | undefined = instance?.callerPlugin.getName();

      // If and only if the instance is a "stateless" + "backend" plugin
      if (
        instance && name
      ) {

        // Collects the instance details into the plugins
        const details: any = {
          name,
          instance: instance.getName()
        };

        details.path = join(process.cwd(), instance.getInstallationPath());
        details.env = await envToJson(join(details.path, ".env"));

        instances.push(details);
      }
    }
  }

  let routes = []

  // Get the instance name
  const plugin = glueStackPlugin.app.getPluginByName('@gluestack/glue-plugin-router-nginx');
  const instance = plugin.getInstances()[0];
  const name: string = instance.getName();
  const routerFilepath = join(process.cwd(), 'meta', 'router', name, 'routes.json');
  if (await fileExists(routerFilepath)) {
    routes = require(routerFilepath);
	}

  const env = new Env(build, routes);
  for await (const instance of instances) {
    await env.addEnv(
      instance.instance,
      instance.env,
      instance.path
    );
  }

  await env.generate();
};
