import { join } from 'path';
import { GlueStackPlugin } from "src";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";
import GluestackWatcher from '../helpers/watcher';

export function developWatch(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("develop:watch")
    .description(
      "Watches and restarts provided container instances",
    )
    .action(() => runner(glueStackPlugin));
}

export async function runner(
  glueStackPlugin: GlueStackPlugin,
) {
  const instances: (
    IPlugin & IHasContainerController
  )[] = glueStackPlugin.app.getContainerTypePluginInstances(true);

  const paths: string[] = [];
  for await (const instance of instances) {
    if (instance && instance?.containerController) {
      try {
        if (typeof instance.containerController.watch === 'function') {
          const files: string[] = await instance.containerController.watch();
          for await (const file of files) {
            const _name = instance.getInstallationPath(instance.getName());
            paths.push(join(_name, file));
          }
        }
      } catch (e) {
        console.log(
          `Failed: ${instance.getName()} instance could not be started`,
        );

        console.log("\x1b[33m\nError:\x1b[31m", e.message, "\x1b[0m");
      }
      console.log();
    }
  }

  if (paths.length > 0) {
    const watcher = new GluestackWatcher(paths);
    watcher.on('add', async (path) => {
      // console.log(`${path} added`);

      if (!watcher.getStatus()) {
        watcher.restart(true);
        await restartsWatchedContainers(instances);
        watcher.restart(false);
      }
    });
    watcher.on('change', async (path) => {
      // console.log(`${path} changed`);

      if (!watcher.getStatus()) {
        watcher.restart(true);
        await restartsWatchedContainers(instances);
        watcher.restart(false);
      }
    });
    watcher.on('unlink', async (path) => {
      // console.log(`${path} deleted`);

      if (!watcher.getStatus()) {
        watcher.restart(true);
        await restartsWatchedContainers(instances);
        watcher.restart(false);
      }
    });
  } else {
    console.log('Nothing to watch. Terminating!');
  }
}

async function restartsWatchedContainers(
  instances: (IPlugin & IHasContainerController)[]
) {
  for await (const instance of instances) {
    if (instance && instance?.containerController) {
      try {
        await instance.containerController.down();
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
}
