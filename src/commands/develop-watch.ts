import { join } from 'path';
import { GlueStackPlugin } from "src";
import IPlugin from "@gluestack/framework/types/plugin/interface/IPlugin";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";

import GluestackWatch from '../core/GlueStackWatch';
import GluestackEngine from '../core/GluestackEngine';
import { IGlueEngine } from "../core/types/IGlueEngine";
import IApp from '@gluestack/framework/types/app/interface/IApp';

export function developWatch(program: any, glueStackPlugin: GlueStackPlugin) {
  const command = program
    .command("develop:watch")
    .description(
      "Watches and restarts containers when registered plugins files changes",
    )
    .action(() => runner(glueStackPlugin));
}

export async function runner(
  gluestackPlugin: GlueStackPlugin,
) {
  const instances: (
    IPlugin & IHasContainerController
  )[] = gluestackPlugin.app.getContainerTypePluginInstances(true);

  // scans all the plugins and gets watchable files and folders paths
  const paths: string[] = await scanForWatchables(instances);
  if (paths.length <= 0) {
    console.log('> Nothing to watch. Terminating!');
    process.exit(-1);
  }

  console.log(`> Watching ${paths.length} directories/files for changes...`);

  const watcher = new GluestackWatch(paths);

  // Create / Touch
  watcher.on('add', async (path) => {
    if (!watcher.getStatus()) {
      watcher.restart(true);
      await restartsWatchedContainers(gluestackPlugin.app);
      watcher.restart(false);
    }
  });

  // Update
  watcher.on('change', async (path) => {
    if (!watcher.getStatus()) {
      watcher.restart(true);
      await restartsWatchedContainers(gluestackPlugin.app);
      watcher.restart(false);
    }
  });

  // Delete
  watcher.on('unlink', async (path) => {
    if (!watcher.getStatus()) {
      watcher.restart(true);
      await restartsWatchedContainers(gluestackPlugin.app);
      watcher.restart(false);
    }
  });

  // CTRL+C
  process.on('SIGINT', async () => {
    console.log('> Gracefully shutting down Gluestack Engine... Please wait as we gracefully shut down all the containers. Thank You!');
    await restartsWatchedContainers(gluestackPlugin.app, true);
    process.exit(0);
  });

  // Keyboard Quit
  process.on('SIGQUIT', async () => {
    console.log('> Gracefully shutting down Gluestack Engine... Please wait as we gracefully shut down all the containers. Thank You!');
    await restartsWatchedContainers(gluestackPlugin.app, true);
    process.exit(0);
  });

  // `kill` Command
  process.on('SIGTERM', async () => {
    console.log('> Gracefully shutting down Gluestack Engine... Please wait as we gracefully shut down all the containers. Thank You!');
    await restartsWatchedContainers(gluestackPlugin.app, true);
    process.exit(0);
  });
};

const restartsWatchedContainers = async (
  app: IApp, down: boolean = false
): Promise<void> => {
  try {
    const engine: IGlueEngine = new GluestackEngine(app, 'backend');

    // stop the engine
    await engine.stop();
    if (!down) {
      // starts the engine
      await engine.start();
    }
  } catch (err) {
    console.log('>> err', err);
  }
};

const scanForWatchables = async (
  instances: (IPlugin & IHasContainerController)[]
): Promise<string[]> => {
  const paths: string[] = [];

  // scans all the plugins and gets watchable files and folders paths
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

  return paths;
};
