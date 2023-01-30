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
      if (!watcher.getStatus()) {
        watcher.restart(true);
        await restartsWatchedContainers(instances);
        watcher.restart(false);
      }
    });

    watcher.on('change', async (path) => {
      if (!watcher.getStatus()) {
        watcher.restart(true);
        await restartsWatchedContainers(instances);
        watcher.restart(false);
      }
    });

    watcher.on('unlink', async (path) => {
      if (!watcher.getStatus()) {
        watcher.restart(true);
        await restartsWatchedContainers(instances);
        watcher.restart(false);
      }
    });

    // CTRL+C
    process.on('SIGINT', async () => {
      await restartsWatchedContainers(instances, true);
      process.exit(0);
    });

    // Keyboard quit
    process.on('SIGQUIT', async () => {
      await restartsWatchedContainers(instances, true);
      process.exit(0);
    });

    // `kill` command
    process.on('SIGTERM', async () => {
      await restartsWatchedContainers(instances, true);
      process.exit(0);
    });
  } else {
    console.log('Nothing to watch. Terminating!');
  }
}

async function restartsWatchedContainers(
  instances: (IPlugin & IHasContainerController)[],
  down: boolean = false
) {
  for await (const instance of instances) {
    if (instance && instance?.containerController) {
      try {
        await instance.containerController.down();
        if (!down) {
          await instance.containerController.up();
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
}